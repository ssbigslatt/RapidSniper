from rest_framework import serializers
from .models import (
    Platform, InstrumentCategory, Instrument, Strategy, 
    Criterion, Trade, TradeCriterion, Markup, UserProgress,
    Balance, TradeNote, Feedback
)

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = '__all__'

class InstrumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InstrumentCategory
        fields = '__all__'

class InstrumentSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    platform_name = serializers.ReadOnlyField(source='platform.name')
    class Meta:
        model = Instrument
        fields = '__all__'

class StrategySerializer(serializers.ModelSerializer):
    class Meta:
        model = Strategy
        fields = '__all__'

class CriterionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterion
        fields = '__all__'

class TradeCriterionSerializer(serializers.ModelSerializer):
    label = serializers.ReadOnlyField(source='criterion.label')
    criterion_type = serializers.ReadOnlyField(source='criterion.criterion_type')
    class Meta:
        model = TradeCriterion
        fields = '__all__'

class MarkupSerializer(serializers.ModelSerializer):
    class Meta:
        
        model = Markup
        fields = '__all__'

class TradeNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeNote
        fields = '__all__'

class TradeSerializer(serializers.ModelSerializer):
    checklist = TradeCriterionSerializer(many=True, read_only=True)
    markups = MarkupSerializer(many=True, read_only=True)
    trade_notes = TradeNoteSerializer(many=True, read_only=True)
    instrument_name = serializers.ReadOnlyField(source='instrument.name')
    
    class Meta:
        model = Trade
        fields = [
            'id', 'user', 'instrument', 'instrument_name', 'strategy', 'trade_type', 
            'status', 'result', 'entry_price', 'exit_price', 'stop_loss', 
            'take_profit', 'pnl', 'notes', 'date', 'checklist', 'markups', 'trade_notes',
            'pair', 'category', 'subcategory',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'

class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = [
            'id', 'user', 'starting_balance', 'risk_percent', 
            'target_percent', 'last_reset_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_reset_at', 'updated_at']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'type', 'email', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
