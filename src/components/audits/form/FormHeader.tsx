
import { CardHeader, CardTitle } from "@/components/ui/card";

interface FormHeaderProps {
  text: string;
}

export function FormHeader({ text }: FormHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>{text}</CardTitle>
    </CardHeader>
  );
}
