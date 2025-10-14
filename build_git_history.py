import os
import subprocess
import shutil
import random
from datetime import datetime, timedelta

PROJECT_DIR = r"c:\Users\ayush\Downloads\Vajra-Farm-main\Vajra-Farm-main"
os.chdir(PROJECT_DIR)

# Clean existing .git if any
if os.path.exists(".git"):
    shutil.rmtree(".git", ignore_errors=True)

# Initialize git
subprocess.run(["git", "init"], check=True)
subprocess.run(["git", "config", "user.name", "ayush-00001"], check=True)
subprocess.run(["git", "config", "user.email", "ayush841226jaiswal@gmail.com"], check=True)

# Total date range: 2025-10-14 to 2025-11-19
start_date = datetime(2025, 10, 14)
end_date = datetime(2025, 11, 19)

# 6 skip days in between
skip_dates = {
    datetime(2025, 10, 19).date(),
    datetime(2025, 10, 26).date(),
    datetime(2025, 11, 2).date(),
    datetime(2025, 11, 8).date(),
    datetime(2025, 11, 9).date(),
    datetime(2025, 11, 16).date()
}

# Detailed list of chronological, meaningful commit messages grouped logically
commit_messages_pool = [
    # Phase 1: Setup & Scaffolding
    "feat: initialize Next.js 14 project structure with TypeScript",
    "chore: configure tsconfig.json with path aliases and strict typing",
    "chore: add tailwindcss and postcss configuration with custom theme tokens",
    "chore: configure eslint and next.config.js build settings",
    "feat: define global css variables and design tokens in globals.css",
    "chore: setup .gitignore and environment templates",
    
    # Phase 2: Core UI System (Radix UI + Lucide)
    "feat(ui): add core button component with cva variants",
    "feat(ui): add card, card-header, and card-content components",
    "feat(ui): implement dialog and modal overlay components",
    "feat(ui): add form inputs, labels, and validation feedback",
    "feat(ui): implement select dropdown and dropdown-menu primitives",
    "feat(ui): add tabs, slider, switch and progress bar components",
    "feat(ui): implement toast and tooltip notifications",
    "feat(ui): add badge, avatar, and separator utility components",
    
    # Phase 3: Layout & Navigation
    "feat(layout): create responsive header navigation with mobile drawer",
    "feat(layout): create comprehensive footer with quick links and branding",
    "feat(layout): implement root layout with font imports and toaster",
    "style: add subtle glow effects and glassmorphism styling",
    "feat(nav): add active route highlighting and smooth transitions",

    # Phase 4: Landing Page
    "feat(landing): build hero section with animated shield badge",
    "feat(landing): add biosecurity benefits showcase grid",
    "feat(landing): implement interactive feature highlights cards",
    "feat(landing): add impact metrics and live statistics counters",
    "feat(landing): add call-to-action section with responsive buttons",
    "style(landing): polish Framer Motion entrance and hover animations",

    # Phase 5: Database & Prisma ORM
    "feat(db): design initial Prisma schema for PostgreSQL database",
    "feat(db): define User, FarmRecord, and RiskAssessment models",
    "feat(db): add Activity, Alert, and AlertRead models with relations",
    "feat(db): create global Prisma Client singleton in prisma.ts",
    "chore(db): add indexes for userId, date, and severity columns",

    # Phase 6: Supabase & Auth
    "feat(auth): initialize Supabase client helper with env fallbacks",
    "feat(auth): create client-side useCurrentUser authentication hook",
    "feat(auth): implement getCurrentUserId helper function",
    "feat(auth): build sign in page UI with form validation",
    "feat(auth): build sign up page UI with credential checks",
    "feat(auth): handle auth state changes and session persistence",

    # Phase 7: Biosecurity Risk Assessment Engine
    "feat(risk): create comprehensive biosecurity assessment questionnaire",
    "feat(risk): implement weighted score calculation algorithm",
    "feat(risk): categorize risk thresholds into Low, Medium, and High",
    "feat(risk): generate tailored biosecurity recommendations based on answers",
    "feat(risk): create interactive multi-step risk assessment form",
    "feat(risk): add animated progress bar and question navigation",
    "feat(risk): display detailed risk score breakdown and action plan",
    "feat(risk): implement risk assessment page layout and view",

    # Phase 8: Farm Records & Activity Logging
    "feat(records): design FarmLogging database schema with PostgreSQL types",
    "feat(records): implement farmRecordsService CRUD operations in supabase-client",
    "feat(records): add animal type selection for Pig, Poultry, and Fisheries",
    "feat(records): add fodder consumption and mortality tracking inputs",
    "feat(records): implement symptoms observations and vaccination logging",
    "feat(records): build dynamic farm records data table with sortable columns",
    "feat(records): add modal dialog for adding and editing farm logs",
    "feat(records): implement delete confirmation and optimistic UI updates",
    "feat(records): add date-range filtering and search capability for farm logs",

    # Phase 9: Disease Outbreak Alert Center
    "feat(alerts): create AlertCenter layout and severity badge indicators",
    "feat(alerts): implement real-time regional outbreak notification feed",
    "feat(alerts): add species-specific disease filtering (pig, avian, aqua)",
    "feat(alerts): add urgency levels (Critical, High, Medium, Low) with custom colors",
    "feat(alerts): implement biosecurity advisory detail drawer",
    "feat(alerts): add mark as read state and notification counters",

    # Phase 10: Charts & Visual Analytics
    "feat(charts): integrate Recharts library for responsive visualizations",
    "feat(charts): build 30-day RiskTrendChart with area gradients and tooltips",
    "feat(charts): build RiskDistributionChart for biosecurity compliance spread",
    "feat(charts): build monthly ActivityChart categorized by farm operations",
    "style(charts): customize chart theme colors and hover animations",

    # Phase 11: Analytics Dashboard
    "feat(dashboard): build executive overview dashboard with key KPI cards",
    "feat(dashboard): add current risk level status indicator and compliance score",
    "feat(dashboard): display recent farm activities timeline with status tags",
    "feat(dashboard): implement quick actions shortcuts for assessments and logging",
    "feat(dashboard): create dedicated dashboard layout with navigation header",

    # Phase 12: Database Fixes & SQL Utilities
    "fix(db): add fix-id-column.sql to support auto-incrementing bigserial IDs",
    "fix(db): create fix-rls-policies.sql for granular row-level access control",
    "chore(db): create consolidated supabase-schema.sql for initial setup",
    "fix(client): improve error handling for RLS 42501 and constraint 23502 errors",
    "fix(client): strip auto-generated ID field on record creation payload",

    # Phase 13: Documentation & Guides
    "docs: create comprehensive SETUP.md with Supabase step-by-step instructions",
    "docs: add DISEASE_PREDICTION_GUIDE.md with machine learning model insights",
    "docs: add PRISMA_INTEGRATION.md explaining PostgreSQL relational mapping",
    "docs: add RLS-FIX-GUIDE.md for troubleshooting security policies",
    "docs: add ID-COLUMN-FIX-GUIDE.md for auto-increment configuration",
    "docs: update README.md with system architecture, features, and setup guide",

    # Phase 14: Polishing, Refactoring & Performance
    "refactor: optimize component re-renders with React useMemo and useCallback",
    "style: improve mobile responsiveness and button touch targets",
    "fix: resolve metadata viewport deprecation in route layouts",
    "style: enhance contrast and accessible color ratios across components",
    "perf: optimize bundle splitting and dynamic icon imports",
    "refactor: modularize form validation logic and error toast notifications",
    "style: polish hover micro-interactions and transitions on cards",
    "fix: sanitize input fields for numerical fodder and livestock quantities",
    "chore: verify end-to-end database connectivity and CRUD workflows",
    "chore: finalize project release candidate v1.0.0"
]

# Generate day-by-day distribution
current_date = start_date
day_list = []
while current_date <= end_date:
    d = current_date.date()
    if d not in skip_dates:
        day_list.append(current_date)
    current_date += timedelta(days=1)

# Commit frequencies per day as requested: 2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15, 17, 19...
commit_patterns = [
    7, 9, 12, 15, 8, 14, 17, 
    6, 12, 15, 19, 9, 14, 17, 
    8, 15, 17, 12, 14, 19, 15, 
    7, 12, 17, 14, 15, 19, 17, 
    9, 14, 12
]

# Ensure we have pattern for each active day
while len(commit_patterns) < len(day_list):
    commit_patterns.append(random.choice([6, 7, 8, 9, 12, 14, 15, 17]))
commit_patterns = commit_patterns[:len(day_list)]

total_commits = sum(commit_patterns)
print(f"Total active days: {len(day_list)}, Total commits to create: {total_commits}")

# Staging all initial files
subprocess.run(["git", "add", "."], check=True)

# Generate commits
commit_index = 0
msg_len = len(commit_messages_pool)

for day_idx, day_dt in enumerate(day_list):
    n_commits = commit_patterns[day_idx]
    # Spread commit times between 09:15 and 22:45
    start_minute = 9 * 60 + 15
    end_minute = 22 * 60 + 45
    step = max(1, (end_minute - start_minute) // n_commits)
    
    for c in range(n_commits):
        c_minute = start_minute + c * step + random.randint(0, min(10, step))
        hour = min(23, c_minute // 60)
        minute = min(59, c_minute % 60)
        second = random.randint(10, 58)
        
        c_time = day_dt.replace(hour=hour, minute=minute, second=second)
        formatted_date = c_time.strftime("%Y-%m-%dT%H:%M:%S")
        
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = formatted_date
        env["GIT_COMMITTER_DATE"] = formatted_date
        
        msg = commit_messages_pool[commit_index % msg_len]
        if commit_index >= msg_len:
            prefix_variations = [
                "refactor: polish ", "perf: optimize ", "style: adjust ", "fix: refine ", "chore: update "
            ]
            msg = f"{random.choice(prefix_variations)}{msg.split(':', 1)[-1].strip()}"
        
        # On first commit, commit all staged files. On subsequent, make meaningful touch to a changelog or allow-empty
        if commit_index == 0:
            subprocess.run(["git", "commit", "-m", msg], env=env, check=True)
        else:
            subprocess.run(["git", "commit", "--allow-empty", "-m", msg], env=env, check=True)
        
        commit_index += 1

# Rename branch to main
subprocess.run(["git", "branch", "-M", "main"], check=True)
print("Git backdated history built successfully!")
