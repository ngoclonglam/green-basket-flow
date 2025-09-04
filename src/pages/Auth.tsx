import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Leaf, ArrowLeft } from 'lucide-react';
import { useAuth, useToast } from '@/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpSchema, SignInSchema, sanitizeHtml } from '@/utils/validation';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Rate limiting: prevent too many attempts
  const isRateLimited = attemptCount >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);

    // Rate limiting check
    if (isRateLimited) {
      setError('Too many attempts. Please wait a few minutes before trying again.');
      setLoading(false);
      return;
    }

    try {
      // Validate input based on form type
      const formData = {
        email: sanitizeHtml(email.trim()),
        password,
        ...(isLogin ? {} : {
          confirmPassword,
          firstName: sanitizeHtml(firstName.trim()),
          lastName: sanitizeHtml(lastName.trim()),
        })
      };

      const schema = isLogin ? SignInSchema : SignUpSchema;
      const validation = schema.safeParse(formData);

      if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message);
        setValidationErrors(errors);
        setLoading(false);
        return;
      }

      let result;
      if (isLogin) {
        result = await signIn(validation.data.email, validation.data.password);
      } else {
        // TypeScript knows this is signup data due to schema validation
        const signupData = validation.data as typeof validation.data & { firstName: string; lastName: string };
        result = await signUp(
          signupData.email, 
          signupData.password, 
          signupData.firstName, 
          signupData.lastName
        );
      }

      if (result.error) {
        setError(result.error.message);
        setAttemptCount(prev => prev + 1);
      } else if (!isLogin) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        setIsLogin(true);
        // Reset form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setAttemptCount(0);
      } else {
        // Successful login - reset attempt counter
        setAttemptCount(0);
        navigate('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setAttemptCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Reset validation errors when switching between login/signup
  useEffect(() => {
    setValidationErrors([]);
    setError('');
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to FreshMarket
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">FreshMarket</h1>
          </div>
          <p className="text-muted-foreground">
            {isLogin ? 'Welcome back! Sign in to your account' : 'Create your account to start shopping'}
          </p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1">
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle className="text-xl">Create Account</CardTitle>
                <CardDescription>
                  Join FreshMarket and start shopping for organic vegetables
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isLogin ? 6 : 8}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {!isLogin && <PasswordStrengthIndicator password={password} />}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLogin}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isRateLimited && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Too many failed attempts. Please wait a few minutes before trying again.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsLogin(false)}>
                    Sign up here
                  </Button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => setIsLogin(true)}>
                    Sign in here
                  </Button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;