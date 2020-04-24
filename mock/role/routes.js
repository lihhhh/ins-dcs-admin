// Just a mock data

export const constantRoutes = [
  
]

export const asyncRoutes = [
  {
    path: '/login',
    hidden: true
  },

  {
    path: '/404',
    hidden: true
  },

  {
    path: '/',
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/rules',
    // redirect: '/example/table',
    name: 'rules',
    meta: { title: '权限管理', icon: 'example' },
    alwaysShow:true,
    children: [
      {
        path: 'role',
        name: 'role',
        meta: { title: '角色管理', icon: 'table' }
      }
    ]
  },

  {
    path: '/form',
    children: [
      {
        path: 'index',
        name: 'Form',
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
