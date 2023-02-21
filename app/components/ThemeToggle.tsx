import { Theme, useTheme } from '~/utils/theme-provider';

export default function ThemeToggle() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return <button onClick={toggleTheme}><span className="font-bold underline dark:font-normal dark:no-underline">Light</span> / <span className="dark:font-bold dark:underline">Dark</span></button>;
}
