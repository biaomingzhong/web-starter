import { commonHandlers } from './common';
import { authHandlers } from './auth';
import { commentsHandlers } from './comments';
import { discussionsHandlers } from './discussions';
import { teamsHandlers } from './teams';
import { usersHandlers } from './users';

export const handlers = [
  ...commonHandlers,
  ...authHandlers,
  ...commentsHandlers,
  ...discussionsHandlers,
  ...teamsHandlers,
  ...usersHandlers,
];
