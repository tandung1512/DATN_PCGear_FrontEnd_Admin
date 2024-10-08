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
            id: 'hi',
            title: 'Hóa đơn',
            type: 'item',
            url: ''
          },
          {
            id: 'badgeshi',
            title: 'Xem hóa dơn',
            type: 'item',
            url: ''
          }
          
         
        ]
      },

      {
        id: 'forms-element',
        title: 'Quản lí người dùng',
        type: 'collapse',
        url: '',
        classes: 'nav-item',
        icon: 'feather icon-file-text',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'tables',
        title: 'Quản lí sản phẩm',
        type: 'collapse',
        url: '/tables/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
 
      {
        id: 'apexChart',
        title: 'Quản lí danh mục',
        type: 'collapse',
        url: 'apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
 
      {
        id: 'auth',
        title: 'Quản lí nhãn hàng',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Nhà cung cấp ',
        type: 'collapse',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Đặc trưng ',
        type: 'collapse',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      
    ]


@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
