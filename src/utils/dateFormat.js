export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const formatTime = (dateString) => {
  // Get the current time in milliseconds
  const now = new Date().getTime();

  // Convert the date string to milliseconds
  const date = parseInt(dateString);

  // Calculate the time difference in seconds
  const diffInSeconds = Math.floor((now - date) / 1000);

  // Format the output based on the time difference
  let formattedTime;
  if (diffInSeconds < 3600) {
    // Less than 1 hour
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    // More than 1 hour
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;
    formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Display the formatted time
  return formattedTime;
};
