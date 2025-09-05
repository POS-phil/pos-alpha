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
            
            //############CATEGORY PAGES######################

            {
                path: 'product-list/category',
                loadComponent: () => import('./components/main-pages/pages/category/category.component').then(m => m.CategoryComponent),
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
                path: 'product-list/category/sort-category',
                loadComponent: () => import('./components/main-pages/pages/category/category-crud/category-sort/category-sort.component').then(m => m.CategorySortComponent),
                title: 'Product List/ Category / Sort Component'
            },
            //#######END OF CATEGORY PAGES##################
            //########### ITEM PAGES #######################
            {
                path: 'menu/item',
                loadComponent: () => import('./components/main-pages/pages/item/item.component').then(m => m.ItemComponent),
                title: 'Create Item'
            },

            {
                path: 'menu/item/add-item',
                loadComponent: () => import('./components/main-pages/pages/item/menu-crud/create-item/create-item.component').then(m => m.CreateItemComponent),
                title: 'Create Item'
            },

            {
                path: 'menu/item/edit-item',
                loadComponent: () => import('./components/main-pages/pages/item/menu-crud/edit-item/edit-item.component').then(m => m.EditItemComponent),
                title: 'Edit Item'
            },

            {
                path: 'menu/item/properties',
                loadComponent: () => import('./components/main-pages/pages/item/menu-crud/properties/properties.component').then(m => m.PropertiesComponent),
                title: 'properties'
            },

            {
                path: 'menu/item/allergens',
                loadComponent: () => import('./components/main-pages/pages/item/menu-crud/allergens/allergens.component').then(m => m.AllergensComponent),
                title: 'allergens'
            },


            {
                path: 'menu/item/recipe',
                loadComponent: () => import('./components/main-pages/pages/item/menu-crud/recipe/recipe.component').then(m => m.RecipeComponent),
                title: 'recipe'
            },
             //###################################### END OF ITEM PAGES ######################################
             //##################################### ADD ONS PAGES ############################################
            {
                path: 'addons-builder',
                loadComponent: () =>
                    import('./components/main-pages/tab-container/modifier-tab/modifier-tab.component').then(m => m.ModifierTabComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'sizes',
                        pathMatch: 'full'
                    },
                    {
                        path: 'sizes',
                        loadComponent: () => import('./components/main-pages/tab-container/pages/addons-builder/sizes/sizes.component').then(m => m.SizesComponent),
                        title: 'Product Lists / Addons Builder / Sizes',
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
<<<<<<< HEAD

            {
                path: 'modifier-option',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/modifier-option/modifier-option.component').then(m => m.ModifierOptionComponent),
                title: 'Product Lists / Modifier Option',
            },
                ]  
            },
            //############CATEGORY PAGES######################
            {
                path: 'product-list/category',
                loadComponent: () => import('./components/main-pages/pages/category/category.component').then(m => m.CategoryComponent),
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
                path: 'product-list/category/sort-category',
                loadComponent: () => import('./components/main-pages/pages/category/category-crud/category-sort/category-sort.component').then(m => m.CategorySortComponent),
                title: 'Product List/ Category / Sort Component'
            },
            //#######END OF CATEGORY PAGES##################
            {
                path: 'menu/item/add-item',
                loadComponent: () => import('./components/main-pages/tab-container/pages/menu-pages/menu-crud/create-item/create-item.component').then(m => m.CreateItemComponent),
                title: 'Create Item'
            },
=======
>>>>>>> 0dad6ccf1d842f5a14804f6e9cce983768217351
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
                path: 'addons-builder/modifier-option/create_sizes',
                loadComponent: () => import('./components/main-pages/tab-container/pages/addons-builder/addons-builder-crud/create-sizes/create-sizes.component').then(m => m.CreateSizesComponent),
                title: 'Create Sizes'
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
             //#####################################END OF ADD ONS PAGES ############################################
            {
                path: 'test',
                loadComponent: () => import('./components/layout/spinner-loader/spinner-loader.component').then(m => m.SpinnerLoaderComponent),
                title: 'Test Page'
            }
        ]
;
//############END OF CATEGORY PAGES##################