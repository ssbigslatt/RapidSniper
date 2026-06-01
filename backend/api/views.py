from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .models import (
    Platform, InstrumentCategory, Instrument, Strategy, 
    Criterion, Trade, TradeCriterion, Markup, UserProgress,
    Balance, TradeNote
)
from .serializers import (
    PlatformSerializer, InstrumentCategorySerializer, InstrumentSerializer,
    StrategySerializer, CriterionSerializer, TradeSerializer,
    TradeCriterionSerializer, MarkupSerializer, UserProgressSerializer,
    BalanceSerializer, TradeNoteSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user:
        # Get or create balance for user
        balance, created = Balance.objects.get_or_create(user=user)
        return Response({
            'username': user.username,
            'id': user.id,
            'email': user.email,
            'starting_balance': balance.starting_balance,
            'risk_percent': balance.risk_percent,
            'target_percent': balance.target_percent,
            'last_reset_at': balance.last_reset_at
        })
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

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
