export function createPageUrl(pageName) {
  switch (pageName) {
    case 'Dashboard':
      return '/dashboard'
    case 'DigitalTwin':
      return '/digitaltwin'
    case 'Analytics':
      return '/analytics'
    case 'Simulator':
      return '/simulator'
    case 'Reports':
      return '/reports'
    case 'Settings':
      return '/settings'
    default:
      return '/'
  }
}


