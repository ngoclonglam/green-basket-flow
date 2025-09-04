import { checkPasswordStrength } from '@/utils/validation';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const { score, feedback } = checkPasswordStrength(password);
  
  const getStrengthLabel = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'text-red-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor(score)}`}>
          {getStrengthLabel(score)}
        </span>
      </div>
      <Progress value={(score / 5) * 100} className="h-2" />
      {feedback.length > 0 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {feedback.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};