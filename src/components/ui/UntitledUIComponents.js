import React from 'react';

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-brand-500 hover:from-primary-600 hover:to-brand-600 text-white shadow-sm hover:shadow-md focus:ring-brand-500',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-gray-500',
    tertiary: 'bg-transparent text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    destructive: 'bg-error-600 hover:bg-error-700 text-white shadow-sm hover:shadow-md focus:ring-error-500',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md focus:ring-success-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
    lg: 'px-5 py-3 text-base rounded-lg gap-2',
    xl: 'px-6 py-3.5 text-base rounded-xl gap-2.5'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  ...props 
}) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${paddingSizes[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    error: 'bg-error-50 text-error-700 border-error-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm'
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// Input Component
export const Input = ({ 
  label,
  error,
  helper,
  icon,
  className = '',
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-3.5 py-2.5 ${icon ? 'pl-10' : ''} bg-white border ${error ? 'border-error-300 focus:ring-error-500' : 'border-gray-300 focus:ring-brand-500'} rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 focus:border-transparent transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {helper && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helper}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

// Avatar Component
export const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md',
  status,
  fallback,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
    '2xl': 'w-16 h-16'
  };
  
  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4'
  };
  
  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-300',
    busy: 'bg-error-500',
    away: 'bg-warning-500'
  };
  
  return (
    <div className="relative inline-block">
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
          {...props}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium border-2 border-white shadow-sm ${className}`}>
          {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white`} />
      )}
    </div>
  );
};

// Metric Card Component
export const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  description,
  className = '',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-error-600 bg-error-50',
    neutral: 'text-gray-600 bg-gray-50'
  };
  
  return (
    <Card className={className} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                {icon}
              </div>
            )}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mb-3">{description}</p>
          )}
          {change && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${changeColors[changeType]}`}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Table Component
export const Table = ({ columns, data, className = '' }) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.accessor ? row[column.accessor] : column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    brand: 'bg-brand-500'
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4'
  };
  
  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`h-full ${variants[variant]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Divider Component
export const Divider = ({ 
  orientation = 'horizontal',
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: 'bg-gray-200',
    light: 'bg-gray-100',
    dark: 'bg-gray-300',
    brand: 'bg-brand-200'
  };
  
  if (orientation === 'vertical') {
    return <div className={`w-px h-full ${variants[variant]} ${className}`} />;
  }
  
  return <div className={`w-full h-px ${variants[variant]} ${className}`} />;
};

// Skeleton Loader Component
export const Skeleton = ({ 
  variant = 'text',
  width,
  height,
  className = ''
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
    card: 'h-32 rounded-xl',
    image: 'h-48 rounded-lg'
  };
  
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

export default {
  Button,
  Card,
  Badge,
  Input,
  Avatar,
  MetricCard,
  Table,
  ProgressBar,
  Divider,
  Skeleton
};