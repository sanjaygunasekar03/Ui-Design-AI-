import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Activity, Plus } from 'lucide-react';
import logo from '../assets/logo-dark.webp';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mock authentication for demonstration
    if (username === 'admin' && password === 'admin123') {
      onLogin();
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] flex flex-col items-center justify-center p-4 selection:bg-blue-100 relative overflow-hidden">
      {/* Dynamic Light Medical Tech Background */}
      <div className="absolute inset-0 z-0">
        {/* Soft light blue radial base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f0f9ff_0%,#e0f2fe_100%)]"></div>
        
        {/* Main large glow (white/light blue) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white rounded-full blur-[140px] pointer-events-none opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] pointer-events-none opacity-40"></div>

        {/* Medical/Tech Patterns (Subtle light blue) */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%23bae6fd' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
               backgroundSize: '80px 80px' 
             }}></div>

        {/* Icons (Light Blue) */}
        <div className="absolute top-[10%] left-[15%] text-blue-200/50 rotate-12"><Plus size={120} strokeWidth={0.5} /></div>
        <div className="absolute bottom-[15%] right-[10%] text-blue-200/50 -rotate-12"><Plus size={140} strokeWidth={0.5} /></div>
        <div className="absolute top-[20%] right-[20%] text-sky-200/50"><Activity size={100} strokeWidth={0.8} /></div>
        <div className="absolute bottom-[10%] left-[20%] text-blue-200/50"><Activity size={80} strokeWidth={0.8} /></div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <img src={logo} alt="Bristol Healthcare Services Logo" className="h-20 w-auto mx-auto" />
      </div>

      {/* Login Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(30,58,138,0.15)] w-full max-w-[440px] p-10 relative z-10 transition-all duration-500 border border-white/50">
        <div className="space-y-6">
          {/* Social Buttons */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <rect width="11" height="11" fill="#f25022" />
                <rect x="12" width="11" height="11" fill="#7fbb00" />
                <rect y="12" width="11" height="11" fill="#00a1f1" />
                <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-slate-400"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 ml-1">
                Password *
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-slate-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Reset Password */}
            <div className="flex justify-start">
              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Reset password
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl">
                <p className="text-red-600 text-xs text-center font-bold tracking-tight">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#2563eb] text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] active:scale-[0.98] active:shadow-none"
            >
              Continue
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500 font-medium">
              Don't have an account?{' '}
              <button className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
