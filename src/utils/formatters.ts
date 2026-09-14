export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return amount < 0 ? `-${formatted}` : formatted;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatAccountNumber = (number: string): string => {
  return `****${number.slice(-4)}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getTransactionDateGroup = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return 'This Week';
  if (diffDays <= 30) return 'This Month';
  return 'Earlier';
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    food: 'restaurant',
    transport: 'car',
    shopping: 'bag',
    entertainment: 'film',
    bills: 'file-text',
    salary: 'briefcase',
    transfer: 'repeat',
    health: 'heart',
    education: 'book',
    groceries: 'shopping-cart',
    coffee: 'coffee',
    fitness: 'activity',
    travel: 'map',
    utilities: 'zap',
    subscription: 'layers',
    other: 'more-horizontal',
  };
  return icons[category] || 'circle';
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    food: '#EF4444',
    transport: '#3B82F6',
    shopping: '#8B5CF6',
    entertainment: '#EC4899',
    bills: '#F59E0B',
    salary: '#10B981',
    transfer: '#6C63FF',
    health: '#EF4444',
    education: '#3B82F6',
    groceries: '#10B981',
    coffee: '#92400E',
    fitness: '#10B981',
    travel: '#0EA5E9',
    utilities: '#F59E0B',
    subscription: '#8B5CF6',
    other: '#6B7280',
  };
  return colors[category] || '#6B7280';
};
