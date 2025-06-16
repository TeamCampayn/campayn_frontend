
interface HeaderProps {
  currentStep: number;
}

export const Header = ({ currentStep }: HeaderProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Campayn
              </span>
              <div className="text-xs text-gray-500 font-medium">Creator Platform</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
