import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./components/authentications/login/login.component').then(m => m.LoginComponent),
        title: 'Login'

    },
    {
        path: '',
        loadComponent: () =>
            import('./components/layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./components/main-pages/tab-container/dashboard-tab/dashboard-tab.component').then(m => m.DashboardTabComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'general',
                        pathMatch: 'full'
                    },
                    {
                        path: 'general',
                        loadComponent: () =>
                            import('./components/main-pages/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
                        title: 'Dashboard / General'
                    },
                    {
                        path: 'stores',
                        loadComponent: () =>
                            import('./components/main-pages/tab-container/pages/dashboard-pages/stores/stores.component').then(m => m.StoresComponent),
                        title: 'Dashboard / Stores'
                    },
                    {
                        path: 'inventory',
                        loadComponent: () =>
                            import('./components/main-pages/tab-container/pages/dashboard-pages/inventory-lpo/inventory-lpo.component').then(m => m.InventoryLpoComponent),
                        title: 'Dashboard / Inventory & LPO'
                    }
                ]
            },
            {
                path: 'transaction-orders',
                loadComponent: () => import('./components/main-pages/pages/transaction-orders/transaction-orders.component').then(m => m.TransactionOrdersComponent),
                title: 'Transaction Orders',
            },
            {
                path: 'menu',
                loadComponent: () => import('./components/main-pages/tab-container/menu-tab/menu-tab.component').then(m => m.MenuTabComponent),
                title: 'Product Lists',
                children: [
                    {
                        path: '',
                        redirectTo: 'categories',
                        pathMatch: 'full'
                    },
                    {
                        path: 'categories',
                        loadComponent: () => import('./components/main-pages/pages/menu/menu.component').then(m => m.MenuComponent),
                        title: 'Product Lists / Categories',
                    },
                    {
                        path: 'item',
                        loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/item/item.component').then(m => m.ItemComponent),
                        title: 'Product Lists / Item',
                    },
                    {
                        path: 'modifier-group',
                        loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-group/modifier-group.component').then(m => m.ModifierGroupComponent),
                        title: 'Product Lists / Modifier Group',
                    }
                ]
            },
            {
                path: 'menu/categories/add-category',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/add-category/add-category.component').then(m => m.AddCategoryComponent),
                title: 'Add Category'
            },
            {
                path:'menu/item/add-item',
                loadComponent :  () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/create-item/create-item.component').then(m => m.CreateItemComponent),
                title: 'Create Item'
            },
             {
                path:'menu/modifier-group/create_modifier',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-group/mg_create/create-modifier/create-modifier.component').then(m => m.CreateModifierComponent),
                title: 'Create Modifier'
            }
        ]
    },

];
