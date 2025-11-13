# LUMEN UI Component Library

Complete design system implementation for LUMEN with petroleum blue (#0A0E1A) background and golden accents (#F5E6D3).

## Installation

```bash
npm install clsx tailwind-merge
```

## Components

### Button
Multi-variant button with loading states and icons.

```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>

// With loading state
<Button variant="secondary" loading>
  Processing...
</Button>

// With icons
<Button
  variant="ghost"
  leftIcon={<IconPlus />}
  rightIcon={<IconArrow />}
>
  Add Item
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `leftIcon`, `rightIcon`: ReactNode

---

### Input
Text input with validation and error handling.

```tsx
import { Input } from '@/components/ui';

<Input
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  error={errors.email}
  validate={(value) => {
    if (!value.includes('@')) return 'Invalid email';
  }}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Props:**
- `type`: 'text' | 'email' | 'number' | 'password' | 'tel' | 'url'
- `label`, `error`, `helperText`: string
- `leftIcon`, `rightIcon`: ReactNode
- `validate`: (value: string) => string | undefined

---

### Card
Container with optional header and footer.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

<Card elevation={2} interactive>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `header`, `footer`: ReactNode
- `elevation`: 0 | 1 | 2 | 3
- `interactive`: boolean

---

### Checkbox
Custom styled checkbox with indeterminate state.

```tsx
import { Checkbox } from '@/components/ui';

<Checkbox
  label="Accept terms and conditions"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Indeterminate state
<Checkbox
  label="Select all"
  checked={allSelected}
  indeterminate={someSelected}
/>
```

**Props:**
- `label`, `error`: string
- `indeterminate`: boolean

---

### Modal
Full-screen and bottom-sheet modal variants.

```tsx
import { Modal } from '@/components/ui';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  variant="bottom-sheet"
  title="Modal Title"
  closeOnBackdrop
  closeOnEscape
>
  Modal content
</Modal>
```

**Props:**
- `variant`: 'fullscreen' | 'bottom-sheet' | 'center'
- `open`: boolean
- `onClose`: () => void
- `closeOnBackdrop`, `closeOnEscape`, `showCloseButton`: boolean

---

### DatePicker
Inline and modal date picker.

```tsx
import { DatePicker } from '@/components/ui';

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  variant="modal"
  label="Select date"
  minDate={new Date()}
  maxDate={new Date('2025-12-31')}
/>
```

**Props:**
- `variant`: 'inline' | 'modal'
- `value`: Date
- `onChange`: (date: Date) => void
- `minDate`, `maxDate`: Date

---

### Select
Custom dropdown with keyboard navigation.

```tsx
import { Select } from '@/components/ui';

<Select
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2', disabled: true },
  ]}
  value={selected}
  onChange={setSelected}
  label="Choose option"
  placeholder="Select..."
/>
```

**Props:**
- `options`: SelectOption[]
- `value`: string
- `onChange`: (value: string) => void

---

### Toast
Notification component with auto-dismiss.

```tsx
import { Toast, ToastContainer } from '@/components/ui';

<ToastContainer position="top-right">
  <Toast
    variant="success"
    title="Success"
    message="Operation completed"
    duration={3000}
    onClose={() => setToast(null)}
  />
</ToastContainer>
```

**Props:**
- `variant`: 'success' | 'error' | 'info' | 'warning'
- `title`, `message`: string
- `duration`: number (ms, 0 for persistent)
- `onClose`: () => void

---

### Badge
Status indicator with dot variant.

```tsx
import { Badge, BadgeGroup } from '@/components/ui';

<Badge variant="success" size="md">
  Active
</Badge>

<Badge variant="error" dot />

<BadgeGroup gap="md">
  <Badge variant="info">Tag 1</Badge>
  <Badge variant="warning">Tag 2</Badge>
</BadgeGroup>
```

**Props:**
- `variant`: 'default' | 'success' | 'error' | 'warning' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean

---

### Switch
Toggle component with labels.

```tsx
import { Switch } from '@/components/ui';

<Switch
  label="Enable notifications"
  labelPosition="right"
  size="md"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

**Props:**
- `label`: string
- `labelPosition`: 'left' | 'right'
- `size`: 'sm' | 'md' | 'lg'

---

## Color System

```typescript
import { petroleum, golden, semantic } from '@/lib/colors';

// Background
petroleum[900] // #0A0E1A

// Accents
golden[300]   // #F5E6D3

// Semantic
semantic.success  // #10B981
semantic.error    // #EF4444
semantic.warning  // #F59E0B
semantic.info     // #3B82F6
```

## Utilities

```typescript
import { cn, formatDate, generateId, debounce, isTouchDevice } from '@/lib/utils';

// Merge classes
cn('px-4', 'px-2') // 'px-2'

// Format date
formatDate(new Date()) // '2025-11-13'

// Generate ID
generateId('component') // 'component-abc123xyz'

// Debounce function
const debouncedFn = debounce(handleSearch, 300);

// Check touch support
if (isTouchDevice()) { /* ... */ }
```

## Accessibility

All components include:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Error announcements

## Mobile-First

- Touch-optimized tap targets
- Gesture support
- Responsive sizing
- Adaptive layouts

## Design Tokens

Configured in `tailwind.config.js`:
- Custom color palette
- Consistent spacing
- Typography scale
- Animation presets
