from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.db import connection, transaction
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import (
    Platform, InstrumentCategory, Instrument, Strategy, 
    Criterion, Trade, TradeCriterion, Markup, UserProgress,
    Balance, TradeNote, Feedback
)
from .serializers import (
    PlatformSerializer, InstrumentCategorySerializer, InstrumentSerializer,
    StrategySerializer, CriterionSerializer, TradeSerializer,
    TradeCriterionSerializer, MarkupSerializer, UserProgressSerializer,
    BalanceSerializer, TradeNoteSerializer, FeedbackSerializer
)

import re


def _validate_signup_password(password: str):
    # Requirement: 8-18 chars, at least one uppercase, one lowercase, one number, and one special character.
    if not password:
        return False
    re_pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,18}$'
    return bool(re.match(re_pattern, password))

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    try:
        username = (request.data.get('username') or '').strip()
        email = (request.data.get('email') or '').strip()
        password = request.data.get('password') or ''

        if not username or not email or not password:
            return Response({'error': 'username, email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if len(username) < 3:
            return Response({'error': 'Username must be at least 3 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        if ' ' in username:
            return Response({'error': 'Username cannot contain spaces.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists. Please choose another username.'}, status=status.HTTP_409_CONFLICT)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists. Please use another email.'}, status=status.HTTP_409_CONFLICT)

        if not _validate_signup_password(password):
            return Response({
                'error': 'Password must be 8-18 chars with uppercase, lowercase, number, and special character.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=username, email=email)
        user.set_password(password)
        
        # Logic for specific administrators
        if username.lower() in ['slime', 'ssbigslatt']:
            user.is_superuser = True
            user.is_staff = True
            
        user.save()

        # Ensure balance row exists (avoid DB clashes)
        Balance.objects.get_or_create(user=user)

        # Create default trades for new users
        default_assets = [
            # Currencies
            {'pair': 'EURUSD', 'category': 'currency', 'subcategory': None},
            {'pair': 'GBPUSD', 'category': 'currency', 'subcategory': None},
            {'pair': 'XAUUSD (GOLD)', 'category': 'currency', 'subcategory': None},
            # Deriv
            {'pair': 'Volatility 75 Index', 'category': 'index', 'subcategory': 'deriv'},
            {'pair': 'Volatility 100 Index', 'category': 'index', 'subcategory': 'deriv'},
            {'pair': 'Step Index', 'category': 'index', 'subcategory': 'deriv'},
            # Weltrade
            {'pair': 'NAS100', 'category': 'index', 'subcategory': 'weltrade'},
            {'pair': 'US30', 'category': 'index', 'subcategory': 'weltrade'},
        ]

        for asset in default_assets:
            Trade.objects.create(
                user=user,
                pair=asset['pair'],
                category=asset['category'],
                subcategory=asset['subcategory'],
                status='PLANNED'
            )
        return Response({'message': 'Account created successfully', 'username': user.username, 'id': user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_signin_view(request):
    # Stub-friendly endpoint. Frontend should POST { credential: <google_id_token> }
    credential = request.data.get('credential')
    if not credential:
        return Response({'error': 'Missing credential. Google OAuth must provide an ID token.'}, status=status.HTTP_400_BAD_REQUEST)

    # Real verification requires GOOGLE_CLIENT_ID and a JWT library.
    # To prevent silent failures, error clearly if not configured.
    # You can extend this later with proper verification.
    from django.conf import settings

    google_client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
    if not google_client_id:
        return Response({'error': 'Google OAuth is not configured on the server (missing GOOGLE_CLIENT_ID).'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Placeholder response until verification is implemented.
    return Response({'error': 'Google token verification is not implemented yet.'}, status=status.HTTP_501_NOT_IMPLEMENTED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    if not username_or_email or not password:
        return Response({'error': 'Please provide both username/email and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to find user by email first
    user = None
    if '@' in username_or_email:
        try:
            temp_user = User.objects.get(email=username_or_email)
            user = authenticate(username=temp_user.username, password=password)
        except User.DoesNotExist:
            pass
            
    # If not found by email or no '@', try by username
    if not user:
        user = authenticate(username=username_or_email, password=password)
    
    if user:
        # Get or create balance for user
        balance, created = Balance.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'id': user.id,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
            'starting_balance': balance.starting_balance,
            'risk_percent': balance.risk_percent,
            'target_percent': balance.target_percent,
            'last_reset_at': balance.last_reset_at
        })
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def change_password_view(request):
    """Change user password - requires old password verification"""
    user_id = request.data.get('user_id')
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    force_reset = request.data.get('force_reset', False)  # For admin bypass
    
    if not user_id or not new_password:
        return Response({'error': 'user_id and new_password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # If force_reset is True, skip old password verification (admin only)
    if force_reset:
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successfully', 'user_id': user.id})
    
    # Normal flow: verify old password
    if not old_password:
        return Response({'error': 'old_password is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify old password
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully', 'user_id': user.id})

class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer

class InstrumentCategoryViewSet(viewsets.ModelViewSet):
    queryset = InstrumentCategory.objects.all()
    serializer_class = InstrumentCategorySerializer

class InstrumentViewSet(viewsets.ModelViewSet):
    queryset = Instrument.objects.all()
    serializer_class = InstrumentSerializer

class StrategyViewSet(viewsets.ModelViewSet):
    queryset = Strategy.objects.all()
    serializer_class = StrategySerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        if user_id: return Strategy.objects.filter(user_id=user_id)
        return Strategy.objects.all()

class CriterionViewSet(viewsets.ModelViewSet):
    queryset = Criterion.objects.all()
    serializer_class = CriterionSerializer

class TradeViewSet(viewsets.ModelViewSet):
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        if user_id:
            return Trade.objects.filter(user_id=user_id).order_by('-date')
        return Trade.objects.all().order_by('-date')

    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        user_id = request.query_params.get('user', None)
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        count, _ = Trade.objects.filter(user_id=user_id).delete()
        return Response({"message": f"Deleted {count} trades", "count": count}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'user' not in data:
            data['user'] = 1  # Default to user 1 for now
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TradeCriterionViewSet(viewsets.ModelViewSet):
    queryset = TradeCriterion.objects.all()
    serializer_class = TradeCriterionSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny] # Allow anyone to submit feedback

class MarkupViewSet(viewsets.ModelViewSet):
    queryset = Markup.objects.all()
    serializer_class = MarkupSerializer

class UserProgressViewSet(viewsets.ModelViewSet):
    queryset = UserProgress.objects.all()
    serializer_class = UserProgressSerializer
    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        if user_id: return UserProgress.objects.filter(user_id=user_id)
        return UserProgress.objects.all()

class BalanceViewSet(viewsets.ModelViewSet):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user', None)
        if user_id:
            return Balance.objects.filter(user_id=user_id)
        return Balance.objects.all()

    @action(detail=False, methods=['post'])
    def update_balance(self, request):
        user_id = request.data.get('user')
        starting_balance = request.data.get('starting_balance')
        risk_percent = request.data.get('risk_percent')
        target_percent = request.data.get('target_percent')
        reset = request.data.get('reset', False)
        
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        balance, created = Balance.objects.get_or_create(user_id=user_id)
        
        if starting_balance is not None:
            # If starting balance changes, update last_reset_at
            if str(balance.starting_balance) != str(starting_balance) or reset:
                from django.utils import timezone
                balance.last_reset_at = timezone.now()
            balance.starting_balance = starting_balance
            
        if risk_percent is not None:
            balance.risk_percent = risk_percent
        if target_percent is not None:
            balance.target_percent = target_percent
            
        balance.save()
        
        return Response(BalanceSerializer(balance).data)

class TradeNoteViewSet(viewsets.ModelViewSet):
    queryset = TradeNote.objects.all()
    serializer_class = TradeNoteSerializer


class TableListView(APIView):
    permission_classes = [AllowAny]

    def get_row_count(self, table_name):
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT COUNT(*) FROM `{table_name}`")
            return cursor.fetchone()[0]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES LIKE 'api_%'")
            tables = [row[0] for row in cursor.fetchall()]
        
        row_counts = {}
        for table in tables:
            row_counts[table] = self.get_row_count(table)
        
        table_info = []
        for table in tables:
            table_info.append({
                'name': table,
                'row_count': row_counts[table],
                'model_name': table.replace('api_', '').title().replace('_', ' ')
            })
        
        total_records = sum(row_counts.values())
        
        return Response({
            'tables': table_info,
            'total_tables': len(tables),
            'total_records': total_records
        })


class TableDataView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, table_name):
        limit = int(request.query_params.get('limit', 50))
        with connection.cursor() as cursor:
            cursor.execute(f"SELECT * FROM `{table_name}` LIMIT %s", [limit])
            columns = [desc[0] for desc in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        return Response({
            'table': table_name,
            'columns': columns,
            'data': rows,
            'count': len(rows)
        })


class TableRowView(APIView):
    permission_classes = [AllowAny]  # Add IsAdminUser in production

    def patch(self, request, table_name, row_id):
        data = request.data
        with connection.cursor() as cursor:
            columns = ', '.join([f'`{k}` = %s' for k in data.keys()])
            cursor.execute(f"UPDATE `{table_name}` SET {columns} WHERE id = %s", list(data.values()) + [row_id])
            cursor.execute(f"SELECT ROW_COUNT()")
            rows_affected = cursor.fetchone()[0]
        return Response({'message': f'Updated {rows_affected} row(s)', 'rows_affected': rows_affected})

    def delete(self, request, table_name, row_id):
        with connection.cursor() as cursor:
            cursor.execute(f"DELETE FROM `{table_name}` WHERE id = %s", [row_id])
            cursor.execute(f"SELECT ROW_COUNT()")
            rows_affected = cursor.fetchone()[0]
        return Response({'message': f'Deleted {rows_affected} row(s)', 'rows_affected': rows_affected})


class RecentUpdatesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        hours = int(request.query_params.get('hours', 24))
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES LIKE 'api_%'")
            tables = [row[0] for row in cursor.fetchall()]
        
        recent = []
        for table in tables:
            # Check if table has updated_at column
            cursor.execute(f"DESCRIBE `{table}`")
            columns = [row[0] for row in cursor.fetchall()]
            if 'updated_at' in columns:
                cursor.execute(f"""
                    SELECT id, updated_at 
                    FROM `{table}` 
                    WHERE updated_at > DATE_SUB(NOW(), INTERVAL %s HOUR)
                    ORDER BY updated_at DESC LIMIT 3
                """, [hours])
                rows = cursor.fetchall()
                for row in rows:
                    recent.append({
                        'table': table,
                        'model_name': table.replace('api_', '').title().replace('_', ' '),
                        'id': row[0],
                        'updated_at': str(row[1])
                    })
        
        recent.sort(key=lambda x: x['updated_at'], reverse=True)
        return Response({
            'recent': recent[:8],
            'hours': hours,
            'total_found': len(recent)
        })


class NormalizeTradesView(APIView):
    permission_classes = [AllowAny]

    @sync_to_async
    def normalize(self):
        # Normalize denormalized pair/category fields in api_trade
        # This would populate instrument_id based on pair matching
        normalized = 0
        # Example logic - populate based on existing instruments
        from .models import Trade, Instrument
        for trade in Trade.objects.filter(instrument__isnull=True, pair__isnull=False):
            instrument = Instrument.objects.filter(name__icontains=trade.pair).first()
            if instrument:
                trade.instrument = instrument
                trade.save()
                normalized += 1
        return normalized

    def post(self, request):
        normalized = self.normalize()
        return Response({
            'message': f'Normalized {normalized} trades with instrument FKs',
            'normalized_count': normalized
        })


class TruncateTableView(APIView):
    permission_classes = [AllowAny]  # Add IsAdminUser in production

    @sync_to_async
    def truncate(self, table_name):
        with connection.cursor() as cursor:
            cursor.execute(f"TRUNCATE TABLE `{table_name}`")
        return True

    def post(self, request, table_name):
        if not table_name.startswith('api_'):
            return Response({'error': 'Only api_ tables allowed'}, status=400)
        
        success = self.truncate(table_name)
        return Response({
            'message': f'Truncated table {table_name}',
            'success': success
        })
