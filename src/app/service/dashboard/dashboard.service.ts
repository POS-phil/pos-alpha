import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../../common/dashboard';
import { TicketsComponent } from '../../components/widgets/widgets-app/tickets/tickets.component';
import { NetSalesComponent } from '../../components/widgets/widgets-app/net-sales/net-sales.component';
import { NetPaymentsComponent } from '../../components/widgets/widgets-app/net-payments/net-payments.component';
import { VoidOrdersComponent } from '../../components/widgets/widgets-app/void-orders/void-orders.component';
import { OrderTypesComponent } from '../../components/widgets/widgets-app/order-types/order-types.component';
import { DiscountAmountComponent } from '../../components/widgets/widgets-app/discount-amount/discount-amount.component';
import { ReturnAmountComponent } from '../../components/widgets/widgets-app/return-amount/return-amount.component';
import { SalesPerGuestComponent } from '../../components/widgets/widgets-app/sales-per-guest/sales-per-guest.component';
import { TopItemsComponent } from '../../components/widgets/widgets-app/top-items/top-items.component';
import { HourlySalesComponent } from '../../components/widgets/widgets-app/hourly-sales/hourly-sales.component';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  widgets = signal<Widget[]>([
    {
      id : 1,
      label : 'Ticket Status',
      content : TicketsComponent,
      options: 1,
      rows: 2,
      columns: 2
      
    },
    {
      id : 2,
      label : 'Net Sales',
      content : NetSalesComponent,
      options: 1,
      rows: 2,
      columns: 2
      
    },
    {
      id : 3,
      label : 'Net Payments',
      content : NetPaymentsComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 4,
      label : 'Void Orders',
      content : VoidOrdersComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 5,
      label : 'Discount Amount',
      content : DiscountAmountComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 6,
      label : 'Sales Per Guest',
      content : SalesPerGuestComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 7,
      label : 'Top Items',
      content : TopItemsComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 8,
      label : 'Return Amount',
      content : ReturnAmountComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 9,
      label : 'Order Types',
      content : OrderTypesComponent,
      options: 1,
      rows: 2,
      columns: 2
    },
    {
      id : 10,
      label : 'Hourly Sales',
      content : HourlySalesComponent,
      options: 1,
      rows: 2,
      columns: 2
    },

  ])

  addedWidgets = signal<Widget[]>([
  ]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgets().filter(w => !addedIds.includes(w.id));
  });

  addWidget(w: Widget){
    this.addedWidgets.set([...this.addedWidgets(), { ...w }])
  };

  updateWidgetPosition(sourceWidgetId : number, targetWidgetId: number){
    const sourceIndex = this.addedWidgets().findIndex(
      (w) => w.id === sourceWidgetId
    );

    if(sourceIndex === -1 ){
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex((w) => w.id === targetWidgetId);
    if(targetIndex === -1 ){
      return;
    }

    const insertAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;

    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);

  }

  updateWidget(id: number, widget: Partial<Widget>) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget};
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index === this.addedWidgets().length - 1 ) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [{ ...newWidgets[index + 1]}, {...newWidgets[index]}]

    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(id:number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if(index === 0 ) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [{ ...newWidgets[index - 1]}, {...newWidgets[index]}]

    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id : number){
    this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
  }

  saveWidgets = effect(() =>  {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(w => ({ ...w}));
    widgetsWithoutContent.forEach(w => {
      delete w.content;
    })

    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsWithoutContent));
  })

  fetchWidgets() {
    const widgetAsString = localStorage.getItem('dashboardWidgets');
    if(widgetAsString) {
      const widgets = JSON.parse(widgetAsString) as Widget[];
      widgets.forEach(widget => {
        const content = this.widgets().find(w => w.id === widget.id)?.content;
        if(content) {
          widget.content = content
        }
      })
      this.addedWidgets.set(widgets);
    }
  }

  constructor() { 
    this.fetchWidgets();
  }
}
