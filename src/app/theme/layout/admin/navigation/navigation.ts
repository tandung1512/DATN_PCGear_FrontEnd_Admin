import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Trang chủ',
    type: 'item',
    url: '/dashboard',
    icon: 'feather icon-home',
    classes: 'nav-item'
  },
  {
    id: 'basic',
    title: 'Quản lí hóa đơn',
    type: 'collapse',
    icon: 'feather icon-box',
    children: [
      {
        id: 'invoice',
        title: 'Hóa đơn chưa giải quyết',
        type: 'item',
        url: '/invoice-pending'
      },
      {
        id: 'view-invoice',
        title: 'Hoá đơn đang vận chuyển',
        type: 'item',
        url: '/invoice-delivery'
      }
    ]
  },
  {
    id: 'forms-element',
    title: 'Quản lí người dùng',
    type: 'collapse',
    classes: 'nav-item',
    icon: 'feather icon-file-text',
    children: [
      {
        id: 'account-list',
        title: 'Danh sách người dùng',
        type: 'item',
        url: '/accounts/list',
        breadcrumbs: true
      },
      {
        id: 'account-create',
        title: 'Thêm người dùng',
        type: 'item',
        url: '/accounts/create',
        breadcrumbs: true
      },
      {
        id: 'account-edit',
        title: 'Chỉnh sửa người dùng',
        type: 'item',
        url: '/accounts/edit/:id',
        breadcrumbs: false,
        hidden: true
      }
    ]
  },
  {
    id: 'tables',
    title: 'Quản lí sản phẩm',
    type: 'collapse',
    icon: 'feather icon-server',
    children: [
      {
        id: 'product-list',
        title: 'Danh sách sản phẩm',
        type: 'item',
        url: '/products'
      },
      {
        id: 'product-create',
        title: 'Thêm sản phẩm',
        type: 'item',
        url: '/products/create'
      }
    ]
  },
  {
    id: 'category',
    title: 'Quản lí danh mục',
    type: 'collapse',
    icon: 'feather icon-pie-chart',
    children: [
      {
        id: 'category-list',
        title: 'Danh sách danh mục',
        type: 'item',
        url: '/categories'
      },
      {
        id: 'category-create',
        title: 'Thêm danh mục',
        type: 'item',
        url: '/categories/create'
      }
    ]
  },
  {
    id: 'brand',
    title: 'Quản lí nhãn hàng',
    type: 'collapse',
    icon: 'feather icon-lock',
    children: [
      {
        id: 'brand-list',
        title: 'Danh sách nhãn hàng',
        type: 'item',
        url: '/brands'
      },
      {
        id: 'brand-create',
        title: 'Thêm nhãn hàng',
        type: 'item',
        url: '/brands/create'
      }
    ]
  },
  {
    id: 'supplier',
    title: 'Nhà cung cấp',
    type: 'collapse',
    icon: 'feather icon-sidebar',
    children: [
      {
        id: 'supplier-list',
        title: 'Danh sách nhà cung cấp',
        type: 'item',
        url: '/suppliers'
      },
      {
        id: 'supplier-create',
        title: 'Thêm nhà cung cấp',
        type: 'item',
        url: '/suppliers/create'
      }
    ]
  },
  {
    id: 'feature',
    title: 'Đặc trưng',
    type: 'collapse',
    icon: 'feather icon-sidebar',
    children: [
      {
        id: 'feature-list',
        title: 'Danh sách đặc trưng',
        type: 'item',
        url: '/features'
      },
      {
        id: 'feature-create',
        title: 'Thêm đặc trưng',
        type: 'item',
        url: '/features/create'
      }
    ]
  }
];


@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
