import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { UnauthorizeComponent } from './authentication/unauthorize/unauthorize.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
      },
      {
        path: 'destination',
        loadComponent: () =>
          import('./destination/destination.component').then(
            (m) => m.DestinationComponent
          ),
      },
      {
        path: 'travel-category',
        loadComponent: () =>
          import('./category/category.component').then(
            (m) => m.CategoryComponent
          ),
      },
      {
        path: 'trip-duration',
        loadComponent: () =>
          import('./duration/duration.component').then(
            (m) => m.DurationComponent
          ),
      },
      {
        path: 'destination-route',
        loadComponent: () =>
          import('./master-route/master-route.component').then(
            (m) => m.MasterRouteComponent
          ),
      },
      {
        path: 'manage-hotels',
        loadComponent: () =>
          import('./master-hotels/master-hotels.component').then(
            (m) => m.MasterHotelsComponent
          ),
      },
      {
        path: 'trip-packages',
        loadComponent: () =>
          import('./packages/all-packages/all-packages.component').then(
            (m) => m.AllPackagesComponent
          ),
      },
      {
        path: 'trip-packages/add',
        loadComponent: () =>
          import('./packages/packages.component').then(
            (m) => m.PackagesComponent
          ),
      },
      {
        path: 'trip-packages/edit/:package_id',
        loadComponent: () =>
          import('./packages/packages.component').then(
            (m) => m.PackagesComponent
          ),
      },
      {
        path: 'trip-faq',
        loadComponent: () => import('./packages/trip-faq/trip-faq.component').then((m) => m.TripFaqComponent),
      },
      {
        path: 'stay-category',
        loadComponent: () => 
          import('./rooms/all-rooms/all-rooms.component').then((m) => m.AllroomComponent),
      },
      
      {
        path: 'forms',
        loadChildren: () =>
          import('./forms/forms.routes').then((m) => m.FORMS_ROUTE),
      },
      {
        path: 'account/change-password',
        loadComponent: () => 
          import('./change-password/change-password.component').then((m) => m.ChangePasswordComponent),
      },
      {
        path: 'blog',
        loadComponent: () => 
          import('./blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'blog/add',
        loadComponent: () => 
          import('./blog/add-edit-blog/add-edit-blog.component').then((m) => m.AddEditBlogComponent),
      },
      {
        path: 'blog/edit/:blog_id',
        loadComponent: () => 
          import('./blog/add-edit-blog/add-edit-blog.component').then((m) => m.AddEditBlogComponent),
      },
      {
        path: 'event',
        loadComponent: () => 
          import('./event/event.component').then((m) => m.EventComponent),
      },
      {
        path: 'event/add',
        loadComponent: () => 
          import('./event/add-edit-event/add-edit-event.component').then((m) => m.AddEditEventComponent),
      },
      {
        path: 'event/edit/:blog_id',
        loadComponent: () => 
          import('./event/add-edit-event/add-edit-event.component').then((m) => m.AddEditEventComponent),
      },
      {
        path: 'faq',
        loadComponent: () => 
          import('./faq/faq.component').then((m) => m.FaqComponent),
      },
      {
        path: 'query-leads/:status',
        loadComponent: () => 
          import('./query-leads/query-leads.component').then((m) => m.QueryLeadsComponent),
      },
      {
        path: 'quotation-request',
        loadComponent: () => 
          import('./request-quotation/request-quotation.component').then((m) => m.RequestQuotationComponent),
      },
      {
        path: 'payment-history',
        loadComponent: () => 
          import('./payment-history/payment-history.component').then((m) => m.PaymentHistoryComponent),
      },
      {
        path: 'testimonial',
        loadComponent: () =>
          import('./testimonial/testimonial.component').then((m) => m.TestimonialComponent),
      },
      {
        path: 'tour-package-reviews',
        loadComponent: () =>
          import('./tour-package-review/tour-package-review.component').then((m) => m.TourPackageReviewComponent),
      },
      {
        path: 'static-page-seo',
        loadComponent: () =>
          import('./static-page-seo/static-page-seo.component').then((m) => m.StaticPageSeoComponent),
      },
      {
        path: 'admin-api-logs',
        loadComponent: () =>
          import('./api-logs/admin-logs/admin-logs.component').then((m) => m.AdminLogsComponent),
      },
      {
        path: 'web-api-logs',
        loadComponent: () =>
          import('./api-logs/web-logs/web-logs.component').then((m) => m.WebLogsComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./user-list/user-list.component').then((m) => m.UserListComponent),
      },
      {
        path: 'admin-list',
        loadComponent: () =>
          import('./admin-user-list/user-list.component').then((m) => m.UserListComponent),
      },
      // {
      //   path: 'role-permission',
      //   loadComponent: () =>
      //     import('./role-permission/role-permission.component').then((m) => m.RolePermissionComponent),
      // },
      {
        path: 'booking-list',
        loadComponent: () =>
          import('./booking-list/booking-list.component').then((m) => m.BookingListComponent),
      },
      {
        path: 'booking-list-success',
        loadComponent: () => import('./booking-list/success-payment/success-payment.component').then((m)=> m.SuccessPaymentComponent)
      },
      {
        path: 'booking-list-partial',
        loadComponent: () => import('./booking-list/partial-payment/partial-payment.component').then((m)=> m.PartialPaymentComponent)
      },
      {
        path: 'booking-list-failed',
        loadComponent: () => import('./booking-list/failed-payment/failed-payment.component').then((m)=> m.FailedPaymentComponent)
      },
      {
        path: 'booking-list-completed',
        loadComponent: () => import('./booking-list/completed-payment/completed-payment.component').then((m)=> m.CompletedPaymentComponent)
      },
      {
        path: 'booking-service-type',
        loadComponent: () =>
          import('./booking-service-type/booking-service-type.component').then((m) => m.BookingServiceTypeComponent),
      },
      {
        path: 'booking-service-providers',
        loadComponent: () =>
          import('./booking-service-provider/booking-service-provider.component').then((m) => m.BookingServiceProviderComponent),
      },
      {
        path: 'promo-code/youtuber',
        loadComponent: () => import('./promo-codes/youtuber/youtuber.component').then((m)=> m.YoutuberComponent),
      },
      {
        path: 'promo-codes/manage',
        loadComponent: () => import('./promo-codes/manage-promocodes/manage-promocodes.component').then((m)=> m.ManagePromocodesComponent),
      },
      {
        path: 'account-ledger/office-expense',
        loadComponent: () => import('./account-ledger/office-expense/office-expense.component').then((m)=> m.OfficeExpenseComponent),
      },
      {
        path: 'account-ledger/ledger-list',
        loadComponent: () => import('./account-ledger/ledger-list/ledger-list.component').then((m)=> m.LedgerListComponent),
      },
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.routes').then(
            (m) => m.EXTRA_PAGES_ROUTE
          ),
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
  {
    path: 'unauthorize',
    component: UnauthorizeComponent
  },
  { path: '**', component: Page404Component },
];
