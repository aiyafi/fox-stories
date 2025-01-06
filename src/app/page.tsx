"use client";

import React, { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { supabase } from "../../utils/supabaseClient";
import styles from "./page.module.css"; // Optional: For custom styling
import { Story } from "../../types/supabase"; // Import the Story type

// Define the structure expected by react-insta-stories
interface InstaStory {
  url: string;
  type: "image" | "video";
  duration?: number; // Duration in milliseconds
}

const Home: React.FC = () => {
  const [stories, setStories] = useState<InstaStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Calculate the timestamp for 24 hours ago
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        // Fetch stories from Supabase where uploaded_at is within the last 24 hours
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .gte("uploaded_at", twentyFourHoursAgo)
          .order("uploaded_at", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          // Type assertion ensures TypeScript understands the data structure
          const storiesData = data as Story[];

          // Map the fetched data to the format required by react-insta-stories
          const formattedStories: InstaStory[] = await Promise.all(
            storiesData.map(async (story) => {
              // Generate the public URL for the media file
              const { data: publicData, error: publicError } = supabase.storage
                .from("stories")
                .getPublicUrl(story.file_name);

              if (publicError) {
                console.error("Error getting public URL:", publicError);
                return {
                  url: "",
                  type: story.file_type.startsWith("video") ? "video" : "image",
                  duration: story.duration || 5000,
                };
              }

              // Determine the type based on the file_type
              const type: "image" | "video" = story.file_type.startsWith("video")
                ? "video"
                : "image";

              return {
                url: publicData?.publicUrl || "",
                type,
                duration: story.duration || 5000, // Default duration 5 seconds
              };
            })
          );

          setStories(formattedStories);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Optional: Customize story options
  const storyOptions = {
    defaultInterval: 5000, // Default duration for stories without a specific duration
    width: 400,
    height: 600,
    loop: true,
    keyboardNavigation: true,
    // Additional options can be added here
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loader}>
          <p>Loading stories...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && stories.length > 0 && (
        <Stories stories={stories} {...storyOptions} />
      )}

      {!isLoading && !error && stories.length === 0 && (
        <div className={styles.noStories}>
          <p>No stories available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
