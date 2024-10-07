![](https://img.shields.io/npm/v/@doo-inc/react-native-widget?style=flat)

# DOO React Native Widget

A package to integrate DOO CX into your React Native mobile application for Android and iOS devices. [DOO CX](https://www.doo.ooo) helps businesses automate routine tasks, optimize sales and customer service processes, and provide personalized interactions by seamlessly integrating AI with existing tools and workflows.

## Installation

Run the command below in your terminal:

```sh
npm install --save @doo-inc/react-native-widget
```

This library depends on [react-native-webview](https://www.npmjs.com/package/react-native-webview) and [async-storage](https://github.com/react-native-async-storage/async-storage). Please follow the instructions provided.

### Usage

* Create a website channel in DOO dashboard.
* Replace `websiteToken` prop in the 'App.js' file as the following:

```
import React, { useState } from 'react';
import DOOWidget from '@doo-inc/react-native-widget';
// Any other imports...

const App = () => {
  const [showWidget, toggleWidget] = useState(false);
  const user = {
    identifier: 'testing_user',
    name: 'Testing User',
    avatar_url: '',
    email: 'test@example.com',
    identifier_hash: '',
  };
  const customAttributes = { accountId: 1, pricingPlan: 'paid', status: 'active' };
  const websiteToken = 'websiteToken';
  const baseUrl = 'https://cx.doo.ooo';
  const locale = 'en';
  const colorScheme='dark'

  return (
    {/* Add your view here... */}
  );
};
```

<table class="table">
<thead><tr>
  <th>Prop</th><th>Default</th><th>Type</th><th>Description</th>
</tr></thead>
<tbody>
  <tr>
    <td>baseUrl</td>
    <td> - </td>
    <td> String </td>
    <td>DOO installation URL</td>
  </tr>
 <tr>
    <td>websiteToken</td>
    <td> - </td>
    <td> String </td>
    <td>Website channel token</td>
  </tr>
  <tr>
    <td>colorScheme</td>
    <td> light </td>
    <td> String </td>
    <td>Widget color scheme (light/dark/auto)</td>
  </tr>
   <tr>
    <td>locale</td>
    <td> en </td>
    <td> String </td>
    <td>Locale</td>
  </tr>
  <tr>
    <td>isModalVisible</td>
    <td> false </td>
    <td> Boolean </td>
    <td>Widget is visible or not</td>
  </tr>
    <tr>
    <td>closeModal</td>
    <td> - </td>
    <td> Function </td>
    <td>Close event</td>
  </tr>
  <tr>
	  <td>user</td>
    <td> {} </td>
    <td> Object </td>
    <td>User information about the user like email, username and avatar_url</td>
  </tr>
  <tr>
   <td>customAttributes</td>
    <td> {} </td>
    <td> Object </td>
    <td>Additional information about the customer</td>
  </tr>
 </tbody>
</table>

The whole example is available in the `/example` directory.

## License

Copyright (C) 2024, DOO Technology Solutions. All rights reserved.
<br />This project is released under the BSD 3-Clause License.
