import NavigationLoaderExample from '../components/NavigationLoaderExample';

export default function NProgressDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              NProgress Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Test various loading patterns and navigation progress indicators
            </p>
          </div>

          <NavigationLoaderExample />

          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About This Demo
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                This page demonstrates the NProgress integration with various loading patterns.
                Try clicking the different buttons to see how the progress bar behaves in different scenarios.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                The navigation links at the bottom will also trigger the progress bar when clicked,
                showing how it works with actual page navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
