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
            // {
            //     path: 'product-list/category',
            //     loadComponent: () => import('./components/main-pages/pages/menu/menu.component').then(m => m.MenuComponent),
            //     title: 'Product List / Category',
            //     children: [
            //         {
            //             path: '',
            //             redirectTo: 'categories',
            //             pathMatch: 'full'
            //         },
            //         {
            //             path: 'categories',
            //             loadComponent: () => import('./components/main-pages/pages/menu/menu.component').then(m => m.MenuComponent),
            //             title: 'Product Lists / Categories',
            //         },
            //     ]
            // },
            {
                path: 'menu/item',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/item/item.component').then(m => m.ItemComponent),
                title: 'Menu / Item',
                children: [

                ]
            },
            {
                path: 'menu/item',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/item/item.component').then(m => m.ItemComponent),
                title: 'Product Lists / Item',
            },
            {
                path: 'addons-builder',
                loadComponent: () =>
                    import('./components/main-pages/tab-container/modifier-tab/modifier-tab.component').then(m => m.ModifierTabComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'modifier-group',
                        pathMatch: 'full'
                    },
                               {
                path: 'modifier-group',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-group/modifier-group.component').then(m => m.ModifierGroupComponent),
                title: 'Product Lists / Modifier Group',
            },

            {
                path: 'modifier-option',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-option/modifier-option.component').then(m => m.ModifierOptionComponent),
                title: 'Product Lists / Modifier Option',
            },
                ]
            },
 
            {
                path: 'product-list/category',
                loadComponent : () => import('./components/main-pages/pages/category/category.component').then(m => m.CategoryComponent),
                title: 'Product List / Categories'
                
            },
            {
                path: 'product-list/category/add-category',
                loadComponent: () => import('./components/main-pages/pages/category/category-crud/add-category/add-category.component').then(m => m.AddCategoryComponent),
                title: 'Product List/ Category / Add Category'
            },
            {
                path: 'product-list/category/:categoryId/edit-category',
                loadComponent: () => import('./components/main-pages/pages/category/category-crud/edit-category/edit-category.component').then(m => m.EditCategoryComponent),
                title: 'Product List/ Category / Edit Category'
            },
            {
                path: 'menu/item/add-item',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/create-item/create-item.component').then(m => m.CreateItemComponent),
                title: 'Create Item'
            },

            {
                path: 'menu/item/edit-item',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/edit-item/edit-item.component').then(m => m.EditItemComponent),
                title: 'Edit Item'
            },

            {
                path: 'menu/item/properties',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/properties/properties.component').then(m => m.PropertiesComponent),
                title: 'properties'
            },

            {
                path: 'menu/item/allergens',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/allergens/allergens.component').then(m => m.AllergensComponent),
                title: 'allergens'
            },


            {
                path: 'menu/item/recipe',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/recipe/recipe.component').then(m => m.RecipeComponent),
                title: 'recipe'
            },




            {
                path: 'addons-builder/modifier-group/create_modifier',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-group/mg_create/create-modifier/create-modifier.component').then(m => m.CreateModifierComponent),
                title: 'Create Modifier'
            },
            {
                path: 'addons-builder/modifier-option/create_modifier_option',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/create-modifier-option/create-modifier-option.component').then(m => m.CreateModifierOptionComponent),
                title: 'Create Modifier Option'
            },
            {
                path: 'addons-builder/modifier-group/edit_modifier_group',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-group/edit-modifier-group/edit-modifier-group.component').then(m => m.EditModifierGroupComponent),
                title: 'Edit Modifier Group'
            },
            {
                path: 'addons-builder/modifier-option/edit_modifier_option',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-option/edit-modifier-option/edit-modifier-option.component').then(m => m.EditModifierOptionComponent),
                title: 'Edit Modifier Option'
            },
            {
                path: 'test',
                loadComponent: () => import('./components/layout/spinner-loader/spinner-loader.component').then(m => m.SpinnerLoaderComponent),
                title: 'Test Page'
            }
        ]
    },

];
