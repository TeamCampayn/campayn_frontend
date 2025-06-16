
interface HeaderProps {
  currentStep: number;
}

export const Header = ({ currentStep }: HeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Amplify</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
