export type TagColorSet = {
  textColor: string;
  borderColor: string;
  backgroundColor: string;
};

export const getRandomTagColor = (excludeColor?: string) => {
  const colorOptions: TagColorSet[] = [
    {
      textColor: "#8000c8", // Purple
      borderColor: "#8000c8",
      backgroundColor: "#f3e8ff",
    },
    {
      textColor: "#15803d", // Green
      borderColor: "#22c55e",
      backgroundColor: "#dcfce7",
    },
    {
      textColor: "#ca8a04", // Yellow
      borderColor: "#facc15",
      backgroundColor: "#fef9c3",
    },
  ];
  
  let randomIndex = Math.floor(Math.random() * colorOptions.length);
  while (colorOptions[randomIndex].backgroundColor === excludeColor) {
    randomIndex = Math.floor(Math.random() * colorOptions.length);
  }

  return colorOptions[randomIndex]
};

export function convertUTCToNormalDate(utcInput:string) {
  const date = new Date(utcInput);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}


export function formatDateDisplay(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();

  // Remove time part for comparison
  const input = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const optionsDateTime: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...optionsTime,
  };

  if (input.getTime() === today.getTime()) {
    return `Today, ${inputDate.toLocaleTimeString(undefined, optionsTime)}`;
  } else if (input.getTime() === yesterday.getTime()) {
    return `Yesterday, ${inputDate.toLocaleTimeString(undefined, optionsTime)}`;
  } else {
    return inputDate.toLocaleString(undefined, optionsDateTime);
  }
}

