export type User = {
    user_id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    profileImageUrl?: string;

    // Physical and Health Details
    gender?: string;
    height?: number;
    startWeight?: number;
    currentWeight: number;
    goalWeight?: number;
    targetDate?: Date;
    dailyCalories?: number;

    // Activity Level
    activityLevel?: 'notVeryActive' | 'lightlyActive' | 'active' | 'veryActive';

    // Account and Media
    isActive?: boolean;
    gallery?: string[];

    // Weekly Goals
    weeklyGoals?: {
        goalType: 'calories' | 'workouts' | 'sleep' | 'activeDays' | 'tryNew';
        targetValue: number; // Target for the week (e.g., steps, workouts, hours)
        progressValue: number; // Current progress for the goal
        startDate: Date; // Start date of the challenge
        endDate: Date; // End date of the challenge (usually a week later)
        isCompleted?: boolean; // Tracks if the challenge is completed
    }[];

    cart?: {
        productId: string;
        quantity: number;
    }[];
};
