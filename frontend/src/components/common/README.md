# Common Components

Bộ common components xịn xò cho React application với CSS thuần và animations mượt mà.

## 📦 Components

### 1. Button
Button component với nhiều variants và states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost' | 'link'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean
- `icon`: React node
- `iconPosition`: 'left' | 'right'

**Ví dụ:**
```jsx
import { Button } from './components/common';

<Button variant="primary" size="medium">Click me</Button>
<Button variant="outline" loading>Loading...</Button>
<Button variant="danger" icon={<TrashIcon />}>Delete</Button>
```

### 2. Dropdown
Dropdown menu với animations và keyboard navigation.

**Props:**
- `trigger`: React node - Element để click mở dropdown
- `align`: 'left' | 'right' | 'center'
- `closeOnClick`: boolean
- `disabled`: boolean

**Ví dụ:**
```jsx
import { Dropdown, DropdownItem, DropdownDivider } from './components/common';

<Dropdown trigger={<Button>Menu</Button>}>
  <DropdownItem icon={<UserIcon />}>Profile</DropdownItem>
  <DropdownItem icon={<SettingsIcon />}>Settings</DropdownItem>
  <DropdownDivider />
  <DropdownItem danger icon={<LogoutIcon />}>Logout</DropdownItem>
</Dropdown>
```

### 3. Menu
Navigation menu với horizontal/vertical layouts.

**Props:**
- `orientation`: 'horizontal' | 'vertical'

**MenuItem Props:**
- `active`: boolean
- `disabled`: boolean
- `icon`: React node
- `badge`: React node
- `href`: string

**Ví dụ:**
```jsx
import { Menu, MenuItem, MenuDivider } from './components/common';

<Menu orientation="horizontal">
  <MenuItem active icon={<HomeIcon />}>Home</MenuItem>
  <MenuItem icon={<UsersIcon />} badge={5}>Users</MenuItem>
  <MenuDivider />
  <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
</Menu>
```

### 4. Modal
Modal dialog với backdrop và animations.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `footer`: React node
- `size`: 'small' | 'medium' | 'large' | 'fullscreen'
- `closeOnOverlay`: boolean
- `showCloseButton`: boolean

**Ví dụ:**
```jsx
import { Modal, Button } from './components/common';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### 5. Input
Input field với label, error states và icons.

**Props:**
- `label`: string
- `placeholder`: string
- `error`: string
- `helperText`: string
- `disabled`: boolean
- `readOnly`: boolean
- `required`: boolean
- `fullWidth`: boolean
- `icon`: React node
- `iconPosition`: 'left' | 'right'

**Ví dụ:**
```jsx
import { Input } from './components/common';

<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
  icon={<EmailIcon />}
  required
  fullWidth
/>
```

### 6. Textarea
Multi-line text input với resize options.

**Props:**
- `label`: string
- `rows`: number
- `resize`: 'none' | 'vertical' | 'horizontal' | 'both'
- `error`: string
- `helperText`: string

**Ví dụ:**
```jsx
import { Textarea } from './components/common';

<Textarea 
  label="Description"
  rows={5}
  resize="vertical"
  placeholder="Enter description..."
/>
```

### 7. Card
Card container với image, header và footer.

**Props:**
- `title`: string
- `subtitle`: string
- `image`: string (URL)
- `imagePosition`: 'top'
- `footer`: React node
- `hoverable`: boolean
- `clickable`: boolean
- `onClick`: function

**Ví dụ:**
```jsx
import { Card, Button } from './components/common';

<Card 
  title="Product Name"
  subtitle="Product category"
  image="/product.jpg"
  hoverable
  footer={<Button fullWidth>Add to Cart</Button>}
>
  <p>Product description here...</p>
</Card>
```

### 8. Badge
Badge component cho labels và counts.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
- `size`: 'small' | 'medium' | 'large'
- `rounded`: boolean
- `dot`: boolean

**Ví dụ:**
```jsx
import { Badge } from './components/common';

<Badge variant="success">Active</Badge>
<Badge variant="danger" rounded dot>Live</Badge>
<Badge variant="primary">New</Badge>
```

### 9. Avatar
Avatar component với status indicator.

**Props:**
- `src`: string (image URL)
- `alt`: string
- `name`: string - Hiển thị initials nếu không có ảnh
- `size`: 'small' | 'medium' | 'large' | 'xlarge'
- `status`: 'online' | 'offline' | 'away' | 'busy'
- `shape`: 'circle' | 'square'

**Ví dụ:**
```jsx
import { Avatar } from './components/common';

<Avatar src="/user.jpg" alt="User" status="online" />
<Avatar name="John Doe" size="large" shape="square" />
```

### 10. Spinner
Loading spinner với multiple sizes và colors.

**Props:**
- `size`: 'small' | 'medium' | 'large'
- `color`: 'primary' | 'secondary' | 'white'
- `fullScreen`: boolean
- `text`: string

**Ví dụ:**
```jsx
import { Spinner } from './components/common';

<Spinner size="medium" />
<Spinner fullScreen text="Loading..." />
```

### 11. Toast
Toast notifications với auto-dismiss.

**Sử dụng:**
```jsx
import { ToastContainer } from './components/common';

// Trong App.jsx, thêm ToastContainer
function App() {
  return (
    <>
      <YourApp />
      <ToastContainer />
    </>
  );
}

// Trong bất kỳ component nào
window.showToast('Success!', 'success');
window.showToast('Error occurred', 'error', 5000);
window.showToast('Warning message', 'warning');
window.showToast('Info message', 'info');
```

## 🎨 Design Features

- ✨ Gradient backgrounds và smooth animations
- 🎯 Accessibility support (keyboard navigation, ARIA labels)
- 📱 Fully responsive
- 🎭 Consistent design language
- ⚡ Lightweight (CSS thuần, không dependencies)
- 🌈 Modern color palette
- 🔄 Smooth transitions và hover effects

## 📥 Import

```jsx
// Import tất cả
import {
  Button,
  Dropdown, DropdownItem, DropdownDivider,
  Menu, MenuItem, MenuDivider,
  Modal,
  Input,
  Textarea,
  Card,
  Badge,
  Avatar,
  Spinner,
  Toast, ToastContainer
} from './components/common';

// Hoặc import riêng lẻ
import Button from './components/common/Button';
import Modal from './components/common/Modal';
```

## 🎯 Best Practices

1. **Accessibility**: Tất cả components đều hỗ trợ keyboard navigation và screen readers
2. **Performance**: Sử dụng CSS thuần cho animations thay vì JS
3. **Flexibility**: Props đa dạng để customize theo nhu cầu
4. **Consistency**: Design system thống nhất across tất cả components
