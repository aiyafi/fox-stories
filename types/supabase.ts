// types/supabase.ts

export interface Story {
    id: number;
    file_name: string;
    file_type: string; // e.g., 'image/jpeg' or 'video/mp4'
    uploaded_at: string; // ISO string
    duration?: number; // Optional field for custom durations (in milliseconds)
}

    export interface Database {
    public: {
        Tables: {
            stories: {
                Row: Story;
                Insert: {
                    file_name: string;
                    file_type: string;
                    uploaded_at: string;
                    duration?: number;
                };
                Update: Partial<Story>;
            };
            // Add other tables here if needed
            };
            // Add other schemas if needed
            };
        }