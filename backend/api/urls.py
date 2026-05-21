from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlatformViewSet, InstrumentCategoryViewSet, InstrumentViewSet,
    StrategyViewSet, CriterionViewSet, TradeViewSet,
    TradeCriterionViewSet, MarkupViewSet, UserProgressViewSet,
    BalanceViewSet, TradeNoteViewSet, FeedbackViewSet,
    login_view, change_password_view,
    signup_view, google_signin_view,
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
router.register(r'feedback', FeedbackViewSet)

from .views import TableListView, TableDataView, NormalizeTradesView, TruncateTableView, TableRowView, RecentUpdatesView, AuthUserTableView, AuthUserDetailView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('signup/', signup_view, name='signup'),
    path('google-signin/', google_signin_view, name='google-signin'),
    path('change-password/', change_password_view, name='change-password'),

    path('tables/', TableListView.as_view(), name='table-list'),
   path('tables/auth_user/', AuthUserTableView.as_view(), name='auth-user-list'),
    path('tables/auth_user/<int:user_id>/', AuthUserDetailView.as_view(), name='auth-user-detail'),
    path('tables/<str:table_name>/', TableDataView.as_view(), name='table-data'),
    path('tables/<str:table_name>/truncate/', TruncateTableView.as_view(), name='truncate-table'),
    path('tables/<str:table_name>/<int:row_id>/', TableRowView.as_view(), name='table-row'),
    path('recent-updates/', RecentUpdatesView.as_view(), name='recent-updates'),
    path('normalize-trades/', NormalizeTradesView.as_view(), name='normalize-trades'),
    path('', include(router.urls)),
]

