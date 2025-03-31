const { PrismaClient, TaskPriority, TaskStatus } = require('@prisma/client');

/**
 * Script to delete all existing tasks and seed the database with realistic tasks
 * with due dates before, after, and on today's date
 */
const prisma = new PrismaClient();
/**
 * Main function to seed the database
 */
async function main(): Promise<void> {
  try {
    // Step 1: Delete all existing tasks and labels
    console.log('Deleting all existing tasks and labels...');
    await prisma.task.deleteMany({});
    await prisma.label.deleteMany({});
    console.log('All tasks and labels deleted successfully.');
    // Step 2: Create labels
    console.log('Creating labels...');
    const labels = [
      {
        name: 'Finance',
        color: '#ef4444', // red
        icon: 'tag'
      },
      {
        name: 'Team',
        color: '#f97316', // orange
        icon: 'heart'
      },
      {
        name: 'Documentation',
        color: '#f59e0b', // amber
        icon: 'bookmark'
      },
      {
        name: 'Client',
        color: '#10b981', // emerald
        icon: 'star'
      },
      {
        name: 'Admin',
        color: '#06b6d4', // cyan
        icon: 'check'
      },
      {
        name: 'Development',
        color: '#3b82f6', // blue
        icon: 'flag'
      },
      {
        name: 'Research',
        color: '#8b5cf6', // violet
        icon: 'bell'
      },
      {
        name: 'Planning',
        color: '#d946ef', // fuchsia
        icon: 'alertCircle'
      }
    ];
    // Create labels in database and store their IDs
    const labelMap = new Map();
    for (const label of labels) {
      const createdLabel = await prisma.label.create({
        data: label
      });
      labelMap.set(label.name, createdLabel.id);
    }
    console.log(`Created ${labels.length} labels successfully.`);
    // Step 3: Create new tasks with various due dates
    console.log('Creating new tasks...');
    const today = new Date();
    // Tasks with due dates before today
    const pastTasks = [
      {
        title: 'Complete quarterly financial report',
        description: 'Analyze Q1 financial data and prepare report for stakeholders',
        priority: TaskPriority.HIGH,
        status: TaskStatus.DONE,
        dueDate: new Date('2025-03-20'),
      },
      {
        title: 'Schedule team building event',
        description: 'Research and book venue for April team building activity',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.DONE,
        dueDate: new Date('2025-03-15'),
      },
      {
        title: 'Update project documentation',
        description: 'Review and update all documentation for the client portal project',
        priority: TaskPriority.LOW,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2025-03-25'),
      },
    ];
    // Tasks with due date on today
    const todayTasks = [
      {
        title: 'Prepare for client presentation',
        description: 'Finalize slides and rehearse presentation for afternoon meeting',
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(today),
      },
      {
        title: 'Submit expense reports',
        description: 'Compile and submit all outstanding expense reports for March',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date(today),
      },
      {
        title: 'Review pull requests',
        description: 'Review and approve pending pull requests for the API refactoring',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date(today),
      },
    ];
    // Tasks with due dates after today
    const futureTasks = [
      {
        title: 'Implement new authentication system',
        description: 'Integrate OAuth 2.0 with the existing user management system',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-10'),
      },
      {
        title: 'Conduct user research interviews',
        description: 'Schedule and conduct interviews with key users for the new dashboard feature',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-20'),
      },
      {
        title: 'Prepare monthly newsletter',
        description: 'Draft and design the April company newsletter',
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-08'),
      },
      {
        title: 'Migrate database to new server',
        description: 'Plan and execute database migration with minimal downtime',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-15'),
      },
      {
        title: 'Organize code review workshop',
        description: 'Prepare materials and exercises for the team code review workshop',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-05'),
      },
      {
        title: 'Optimize application performance',
        description: 'Identify and fix performance bottlenecks in the main application',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-12'),
      },
      {
        title: 'Create onboarding documentation',
        description: 'Develop comprehensive onboarding materials for new team members',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-20'),
      },
      {
        title: 'Implement accessibility improvements',
        description: 'Ensure all web interfaces meet WCAG 2.1 AA standards',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-30'),
      },
      {
        title: 'Set up continuous deployment pipeline',
        description: 'Configure CI/CD pipeline for automated testing and deployment',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-08'),
      },
      {
        title: 'Plan Q2 roadmap',
        description: 'Collaborate with stakeholders to finalize Q2 product roadmap',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date('2025-04-03'),
      },
    ];
    // Tasks with no due date
    const noDueDateTasks = [
      {
        title: 'Research AI integration possibilities',
        description: 'Explore potential AI integrations for improving product recommendations',
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        dueDate: null,
      },
      {
        title: 'Update personal development plan',
        description: 'Review and update personal development goals for Q2',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: null,
      },
    ];
    // Associate labels with tasks
    const taskLabels: Record<string, string[]> = {
      'Complete quarterly financial report': ['Finance', 'Documentation'],
      'Schedule team building event': ['Team', 'Planning'],
      'Update project documentation': ['Documentation', 'Development'],
      'Prepare for client presentation': ['Client', 'Documentation'],
      'Submit expense reports': ['Finance', 'Admin'],
      'Review pull requests': ['Development', 'Team'],
      'Implement new authentication system': ['Development', 'Planning'],
      'Conduct user research interviews': ['Research', 'Client'],
      'Prepare monthly newsletter': ['Documentation', 'Team'],
      'Migrate database to new server': ['Development', 'Planning'],
      'Organize code review workshop': ['Development', 'Team', 'Planning'],
      'Research AI integration possibilities': ['Research', 'Development'],
      'Update personal development plan': ['Planning', 'Team'],
      'Optimize application performance': ['Development', 'Planning'],
      'Create onboarding documentation': ['Documentation', 'Team'],
      'Implement accessibility improvements': ['Development', 'Client'],
      'Set up continuous deployment pipeline': ['Development', 'Planning'],
      'Plan Q2 roadmap': ['Planning', 'Team', 'Client']
    };
    // Combine all tasks
    const allTasks = [...pastTasks, ...todayTasks, ...futureTasks, ...noDueDateTasks];
    // Create tasks in database with labels
    for (const task of allTasks) {
      const labels: string[] = taskLabels[task.title] || [];
      const labelIds = labels.map((labelName: string) => ({ id: labelMap.get(labelName) }));
      await prisma.task.create({
        data: {
          ...task,
          labels: {
            connect: labelIds
          }
        },
      });
    }
    console.log(`Successfully created ${allTasks.length} new tasks.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}
// Run the seeding function
main()
  .then(() => console.log('Database seeding completed successfully.'))
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });