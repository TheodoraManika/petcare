# Breadcrumb Implementation Guide

## Overview
Breadcrumbs are implemented in the **PageLayout** component and automatically display navigation hierarchy on pages. The breadcrumb bar shows: `Home > [custom breadcrumbs] > current page title`

## Files Responsible
- **[src/components/global/layout/PageLayout.jsx](src/components/global/layout/PageLayout.jsx)** - Component logic
- **[src/components/global/layout/PageLayout.css](src/components/global/layout/PageLayout.css)** - Styling

## How to Add Breadcrumbs to a Page

### Step 1: Import PageLayout
```jsx
import PageLayout from '../../components/global/layout/PageLayout';
```

### Step 2: Wrap Your Page Content
Wrap your page content with the `PageLayout` component and pass the `title` and optional `breadcrumbs` props.

### Step 3: Configure Props

#### Required Props
- **`title`** (string): The current page title that appears as the last breadcrumb item

#### Optional Props
- **`breadcrumbs`** (array): Array of breadcrumb objects to create a custom hierarchy
  - Each object should have: `{ label: string, path: string }`
  - Example: `[{ label: 'Lost Pets', path: '/citizen/lost-pets' }, { label: 'Pet Details', path: '/citizen/lost-pets/123' }]`

## Example Implementation

### Simple Page (Title Only)
```jsx
import React from 'react';
import PageLayout from '../../components/global/layout/PageLayout';

const SimplePage = () => {
  return (
    <PageLayout title="My Page Title">
      <div className="page-content">
        {/* Your page content here */}
      </div>
    </PageLayout>
  );
};

export default SimplePage;
```

**Breadcrumb Result:** `Home > My Page Title`

### Page with Custom Breadcrumbs
```jsx
import React from 'react';
import PageLayout from '../../components/global/layout/PageLayout';
import { ROUTES } from '../../utils/constants';

const DetailPage = () => {
  const breadcrumbItems = [
    { label: 'Lost Pets', path: ROUTES.citizen.lostPets },
    { label: 'Specific Pet', path: '/citizen/lost-pets/123' }
  ];

  return (
    <PageLayout title="Pet Details" breadcrumbs={breadcrumbItems}>
      <div className="page-content">
        {/* Your page content here */}
      </div>
    </PageLayout>
  );
};

export default DetailPage;
```

**Breadcrumb Result:** `Home > Lost Pets > Specific Pet > Pet Details`

## PageLayout Features
- **Automatic Navigation Bar**: Shows appropriate navbar based on login status (Navbar or NavbarPublic)
- **Automatic Footer**: Includes Footer component at the bottom
- **Responsive Design**: Works on all screen sizes
- **Breadcrumb Navigation**: Clickable breadcrumb links for easy navigation back

## Breadcrumb Styling Classes
If you need to customize breadcrumb styles, these CSS classes are available:
- `.page-layout__breadcrumbs` - Container for all breadcrumbs
- `.page-layout__breadcrumb-link` - Clickable breadcrumb links
- `.page-layout__breadcrumb-separator` - The ">" separator
- `.page-layout__breadcrumb-current` - Current page title (not clickable)

## Notes
- Breadcrumbs always start with "Home" (home icon)
- The home icon is always clickable and links to ROUTES.home
- Current page title is not clickable
- All custom breadcrumb items are clickable links
- Breadcrumbs automatically handle responsive layout on mobile devices
