export default {
  items: [
    {
      name: 'Dashboard',
      url: '/admin/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info'
      }
    },
    {
      name: 'Elections',
      icon: 'fa fa-line-chart',
      children: [
        {
          name: 'New Election',
          url: '/admin/elections/new',
          icon: 'icon-note'
        },
        {
          name: 'View Elections',
          url: '/admin/elections/list',
          icon: 'icon-list'
        }
      ]
    },
    {
      name: 'Parties',
      icon: 'fa fa-users',
      children: [
        {
          name: 'New Party',
          url: '/admin/parties/new',
          icon: 'icon-note'
        },
        {
          name: 'View Parties',
          url: '/admin/parties/list',
          icon: 'icon-list'
        }
      ]
    },
    {
      name: 'Voters',
      icon: 'fa fa-user',
      children: [
        {
          name: 'New Voter',
          url: '/admin/voters/new',
          icon: 'icon-note'
        },
        {
          name: 'View Voters',
          url: '/admin/voters/list',
          icon: 'icon-list'
        }
      ]
    },
    {
      name: 'Administrators',
      icon: 'fa fa-lg fa-lock',
      children: [
        {
          name: 'New Administrator',
          url: '/admin/administrators/new',
          icon: 'icon-note'
        },
        {
          name: 'View Administrators',
          url: '/admin/administrators/list',
          icon: 'icon-list'
        }
      ]
    },
    {
      name: 'Roles',
      icon: 'fa fa-ban',
      children: [
        {
          name: 'New Role',
          url: '/admin/roles/new',
          icon: 'icon-note'
        },
        {
          name: 'View Roles',
          url: '/admin/roles/list',
          icon: 'icon-list'
        }
      ]
    }
  ]
}
