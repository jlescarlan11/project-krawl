/**
 * User API Client
 *
 * API functions for user-related operations
 */

/**
 * User profile response
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  statistics: UserStatistics;
  privacySettings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * User statistics
 */
export interface UserStatistics {
  gemsCreated: number;
  krawlsCreated: number;
  vouchesGiven: number;
  krawlsCompleted: number;
}

/**
 * Paginated content response
 */
export interface UserContentResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

/**
 * Notification preferences request
 */
export interface NotificationPreferencesRequest {
  email?: Record<string, boolean>;
  push?: Record<string, boolean>;
}

/**
 * Privacy settings request
 */
export interface PrivacySettingsRequest {
  profileVisibility?: "public" | "private" | "friends_only";
  toggles?: Record<string, boolean>;
}

/**
 * App preferences request
 */
export interface AppPreferencesRequest {
  mapStyle?: "standard" | "satellite" | "dark";
  language?: "en" | "ceb";
  units?: "metric" | "imperial";
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user statistics
 */
export async function getUserStatistics(
  userId: string
): Promise<UserStatistics> {
  const response = await fetch(`/api/users/${userId}/statistics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch statistics: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's created Gems
 */
export async function getUserGems(
  userId: string,
  page: number = 0,
  limit: number = 20
): Promise<UserContentResponse<unknown>> {
  const response = await fetch(
    `/api/users/${userId}/gems?page=${page}&size=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Gems: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's created Krawls
 */
export async function getUserKrawls(
  userId: string,
  page: number = 0,
  limit: number = 20
): Promise<UserContentResponse<unknown>> {
  const response = await fetch(
    `/api/users/${userId}/krawls?page=${page}&size=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Krawls: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's vouched Gems
 */
export async function getUserVouchedGems(
  userId: string,
  page: number = 0,
  limit: number = 20
): Promise<UserContentResponse<unknown>> {
  const response = await fetch(
    `/api/users/${userId}/vouched-gems?page=${page}&size=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch vouched Gems: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's completed Krawls
 */
export async function getUserCompletedKrawls(
  userId: string,
  page: number = 0,
  limit: number = 20
): Promise<UserContentResponse<unknown>> {
  const response = await fetch(
    `/api/users/${userId}/completed-krawls?page=${page}&size=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch completed Krawls: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await fetch(`/api/users/${userId}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: NotificationPreferencesRequest
): Promise<void> {
  const response = await fetch(`/api/users/${userId}/notifications`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update notification preferences: ${response.statusText}`
    );
  }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(
  userId: string,
  settings: PrivacySettingsRequest
): Promise<void> {
  const response = await fetch(`/api/users/${userId}/privacy`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update privacy settings: ${response.statusText}`);
  }
}

/**
 * Update app preferences
 */
export async function updateAppPreferences(
  userId: string,
  preferences: AppPreferencesRequest
): Promise<void> {
  const response = await fetch(`/api/users/${userId}/preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error(`Failed to update app preferences: ${response.statusText}`);
  }
}

/**
 * Delete user account
 */
export async function deleteAccount(userId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete account: ${response.statusText}`);
  }
}

/**
 * Disconnect OAuth provider
 */
export async function disconnectOAuthProvider(
  userId: string,
  provider: string
): Promise<void> {
  const response = await fetch(`/api/users/${userId}/connections/${provider}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to disconnect provider: ${response.statusText}`
    );
  }
}

