import {
	backButton,
	viewport,
	themeParams,
	miniApp,
	initData,
	$debug,
	init as initSDK,
	retrieveLaunchParams,
} from '@telegram-apps/sdk-react'

/**
 * Initializes the application and configures its dependencies.
 */
export function initMiniApp(): void {
	// Check if all required components are supported.
	if (!backButton.isSupported() || !miniApp.isSupported()) {
		return
	}

	const searchParams = retrieveLaunchParams()
	const debug = searchParams.startParam === 'debug' || import.meta.env.DEV

	// Set @telegram-apps/sdk-react debug mode.
	$debug.set(debug)

	// Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
	// Also, configure the package.
	initSDK()

	// Add Eruda if needed.
	debug &&
		import('eruda').then((lib) => lib.default.init()).catch(console.error)

	// Mount all components used in the project.
	backButton.mount()
	miniApp.mount()
	themeParams.mount()
	initData.restore()
	void viewport
		.mount()
		.catch((e) => {
			console.error('Something went wrong mounting the viewport', e)
		})
		.then(() => {
			viewport.bindCssVars()
		})

	// Define components-related CSS variables.
	miniApp.bindCssVars()
	themeParams.bindCssVars()
}