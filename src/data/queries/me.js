/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import UserType from '../types/UserType';
import Exception from '../exception';

const me = {
  type: UserType,
  resolve({}, args, { user }) {
    if (!user) throw Exception.permissionError();
    return (
      user && {
        id: user._id,
        email: user.email,
      }
    );
  },
};

export default me;
