import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/auth/LoginPage';
import * as fs from 'fs';
import * as path from 'path';

const userTestData = [
  {
    role: 'Skill Seeker',
    emailKey: 'STUDENT_EMAIL',
    passwordKey: 'STUDENT_PASSWORD', 
    nameKey: 'STUDENT_NAME'
  },
  {
    role: 'Skill Guide',
    emailKey: 'GUIDE_EMAIL',
    passwordKey: 'GUIDE_PASSWORD',
    nameKey: 'GUIDE_NAME'
  },
  {
    role: 'Skill Mentor',
    emailKey: 'MENTOR_EMAIL', 
    passwordKey: 'MENTOR_PASSWORD',
    nameKey: 'MENTOR_NAME'
  }
];

// Helper function to initialize auth directory and handle force refresh
function initializeAuthSetup() {
  // Check if we want to force refresh auth states
  const forceRefresh = process.env.FORCE_AUTH_REFRESH === 'true';
  
  const authDir = '.auth';
  
  // Ensure .auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
    console.log(`📁 Created .auth directory`);
  }
  
  if (forceRefresh) {
    console.log('🧹 Force refresh enabled - clearing existing auth states...');
    if (fs.existsSync(authDir)) {
      const files = fs.readdirSync(authDir);
      files.forEach(file => {
        if (file.endsWith('-auth.json')) {
          fs.unlinkSync(path.join(authDir, file));
          console.log(`🗑️ Deleted: ${file}`);
        }
      });
    }
  }
}

// Initialize auth setup once at module level
initializeAuthSetup();

userTestData.forEach(({ role, emailKey, passwordKey, nameKey }) => {
  setup(`authenticate as ${role}`, async ({ page, context }) => {
    // Check if auth state file already exists
    const roleFileName = role.toLowerCase().replace(' ', '-');
    const authStatePath = path.join('.auth', `${roleFileName}-auth.json`);
    
    // Skip if auth state exists and force refresh is not enabled
    if (fs.existsSync(authStatePath)) {
      console.log(`✅ Auth state for ${role} already exists at: ${authStatePath}`);
      console.log(`⏭️ Skipping authentication setup for ${role}`);
      return;
    }
    
    const loginPage = new LoginPage(page);
    
    const user_name = loginPage.config().getEnvVariable(emailKey);
    const user_password = loginPage.config().getEnvVariable(passwordKey);
    const user_display_name = loginPage.config().getEnvVariable(nameKey);
    
    // Skip if credentials not configured
    if (!user_name || !user_password || !user_display_name) {
      console.log(`⚠️ Skipping ${role} setup - credentials not configured`);
      return;
    }
    
    console.log(`🔑 Setting up authentication for ${role}...`);
    console.log(`📁 Auth state will be saved to: ${authStatePath}`);
    
    await loginPage.goto();
    await loginPage.verifyLoginPageDisplayed();
    await loginPage.login(user_name, user_password);
    await loginPage.waitForLoginSuccess();
    await loginPage.verifyUserProfileDisplayed(user_display_name, role);
    
    // Save auth state
    await loginPage.saveAuthState(role, context);
    
    console.log(`✅ ${role} authentication setup completed`);
  });
});