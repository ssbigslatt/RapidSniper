from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlatformViewSet, InstrumentCategoryViewSet, InstrumentViewSet,
    StrategyViewSet, CriterionViewSet, TradeViewSet,
    TradeCriterionViewSet, MarkupViewSet, UserProgressViewSet,
    BalanceViewSet, TradeNoteViewSet, login_view
)

router = DefaultRouter()
router.register(r'platforms', PlatformViewSet)
router.register(r'instrument-categories', InstrumentCategoryViewSet)
router.register(r'instruments', InstrumentViewSet)
router.register(r'strategies', StrategyViewSet)
router.register(r'criteria', CriterionViewSet)
router.register(r'trades', TradeViewSet)
router.register(r'trade-criteria', TradeCriterionViewSet)
router.register(r'markups', MarkupViewSet)
router.register(r'user-progress', UserProgressViewSet)
router.register(r'balances', BalanceViewSet)
router.register(r'trade-notes', TradeNoteViewSet)

urlpatterns = [
    path('login/', login_view, name='login'),
    path('', include(router.urls)),
]
