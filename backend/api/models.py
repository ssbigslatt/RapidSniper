from django.db import models
from django.contrib.auth.models import User

class Platform(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name

class InstrumentCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name

class Instrument(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(InstrumentCategory, on_delete=models.CASCADE, related_name='instruments')
    platform = models.ForeignKey(Platform, on_delete=models.SET_NULL, null=True, blank=True, related_name='instruments')
    def __str__(self): return f"{self.name} ({self.category.name})"

class Strategy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='strategies')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    class Meta:
        verbose_name_plural = "Strategies"
    def __str__(self): return f"{self.name} ({self.user.username})"

class Criterion(models.Model):
    TYPES = [('ANALYSIS', 'Analysis'), ('ENTRY', 'Entry'), ('EXIT', 'Exit')]
    strategy = models.ForeignKey(Strategy, on_delete=models.CASCADE, related_name='criteria')
    label = models.CharField(max_length=255)
    criterion_type = models.CharField(max_length=20, choices=TYPES)
    order = models.PositiveIntegerField(default=0)
    class Meta:
        verbose_name_plural = "Criteria"
        ordering = ['order']

class Trade(models.Model):
    TYPES = [('LONG', 'Long'), ('SHORT', 'Short')]
    STATUS = [('PLANNED', 'Planned'), ('ACTIVE', 'Active'), ('CLOSED', 'Closed')]
    RESULTS = [('WIN', 'Win'), ('LOSS', 'Loss'), ('BE', 'Breakeven')]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trades_v2')
    instrument = models.ForeignKey(Instrument, on_delete=models.PROTECT, related_name='trades', null=True, blank=True)
    strategy = models.ForeignKey(Strategy, on_delete=models.SET_NULL, null=True, blank=True, related_name='trades')
    
    # Simple fields for Rapid Sniper Trades
    pair = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50, blank=True)
    subcategory = models.CharField(max_length=50, blank=True)
    
    trade_type = models.CharField(max_length=10, choices=TYPES, default='LONG')
    status = models.CharField(max_length=10, choices=STATUS, default='PLANNED')
    result = models.CharField(max_length=10, choices=RESULTS, null=True, blank=True)
    
    entry_price = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    exit_price = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    stop_loss = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    take_profit = models.DecimalField(max_digits=20, decimal_places=8, null=True, blank=True)
    
    pnl = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.trade_type} {self.instrument.name} - {self.result or self.status}"

class TradeNote(models.Model):
    trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='trade_notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note for {self.trade.pair} at {self.created_at}"

class TradeCriterion(models.Model):
    trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='checklist')
    criterion = models.ForeignKey(Criterion, on_delete=models.CASCADE)
    is_met = models.BooleanField(default=False)
    class Meta:
        unique_together = ('trade', 'criterion')

class Markup(models.Model):
    trade = models.ForeignKey(Trade, on_delete=models.CASCADE, related_name='markups')
    image_url = models.URLField(max_length=500)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserProgress(models.Model):
    STATUS = [('LOCKED', 'Locked'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    phase_number = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS, default='LOCKED')
    completed_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        unique_together = ('user', 'phase_number')
        verbose_name_plural = "User Progress"

from django.utils import timezone

class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='balance')
    starting_balance = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    risk_percent = models.DecimalField(max_digits=5, decimal_places=2, default=1.00)
    target_percent = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    last_reset_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Starting: ${self.starting_balance}"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='feedbacks')
    type = models.CharField(max_length=50)
    email = models.EmailField(blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback ({self.type}) from {self.user.username if self.user else 'Anonymous'}"