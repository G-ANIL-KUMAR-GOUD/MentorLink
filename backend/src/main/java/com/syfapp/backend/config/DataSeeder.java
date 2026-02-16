package com.syfapp.backend.config;

import com.syfapp.backend.models.*;
import com.syfapp.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BatchRepository batchRepository;
    private final SkillRepository skillRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final MenteeProfileRepository menteeProfileRepository;
    private final UserRoleRepository userRoleRepository;
    private final MentorMenteeMapRepository mentorMenteeMapRepository;
    private final TaskRepository taskRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if database is empty
        if (userRepository.count() > 0) {
            System.out.println("Database already contains data. Skipping seeding.");
            return;
        }

        System.out.println("Starting database seeding...");

        // 1. Create Skills
        List<Skill> skills = createSkills();
        System.out.println("Created " + skills.size() + " skills");

        // 2. Create Roles
        Role adminRole = createRole("Admin");
        Role mentorRole = createRole("Mentor");
        Role menteeRole = createRole("Mentee");
        System.out.println("Created roles");

        // 3. Create Users
        List<User> admins = createAdmins();
        List<User> mentors = createMentors();
        List<User> mentees = createMentees();
        System.out.println("Created " + (admins.size() + mentors.size() + mentees.size()) + " users");

        // 4. Create Batches
        List<Batch> batches = createBatches(admins);
        System.out.println("Created " + batches.size() + " batches");

        // 5. Assign UserRoles
        assignUserRoles(admins, adminRole, batches);
        assignUserRoles(mentors, mentorRole, batches);
        assignUserRoles(mentees, menteeRole, batches);
        System.out.println("Assigned user roles");

        // 6. Create Mentor Profiles
        List<MentorProfile> mentorProfiles = createMentorProfiles(mentors, skills);
        System.out.println("Created " + mentorProfiles.size() + " mentor profiles");

        // 7. Create Mentee Profiles
        List<MenteeProfile> menteeProfiles = createMenteeProfiles(mentees, skills);
        System.out.println("Created " + menteeProfiles.size() + " mentee profiles");

        // 8. Create Mentor-Mentee Mappings
        List<MentorMenteeMap> mappings = createMentorMenteeMappings(mentorProfiles, menteeProfiles, batches);
        System.out.println("Created " + mappings.size() + " mentor-mentee mappings");

        // 9. Create Tasks
        List<Task> tasks = createTasks(mappings);
        System.out.println("Created " + tasks.size() + " tasks");

        // 10. Create Feedback
        List<Feedback> feedbacks = createFeedback(mappings);
        System.out.println("Created " + feedbacks.size() + " feedback entries");

        System.out.println("Database seeding completed successfully!");
    }

    private List<Skill> createSkills() {
        String[] skillNames = {
            "Java", "Spring Boot", "React", "TypeScript", "JavaScript", "Python",
            "Node.js", "Angular", "Vue.js", "Go", "Rust", "C++",
            "UI/UX Design", "Figma", "Adobe XD", "Sketch",
            "Data Analysis", "Machine Learning", "TensorFlow", "PyTorch",
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
            "PostgreSQL", "MongoDB", "MySQL", "Redis",
            "Leadership", "Communication", "Project Management", "Agile", "Scrum",
            "DevOps", "CI/CD", "Jenkins", "GitHub Actions",
            "Testing", "JUnit", "Selenium", "Cypress",
            "REST API", "GraphQL", "Microservices", "System Design"
        };

        List<Skill> skills = new ArrayList<>();
        for (String skillName : skillNames) {
            Skill skill = new Skill();
            skill.setSkillName(skillName);
            skills.add(skillRepository.save(skill));
        }
        return skills;
    }

    private Role createRole(String roleName) {
        Role role = new Role();
        role.setRoleName(roleName);
        return roleRepository.save(role);
    }

    private List<User> createAdmins() {
        List<User> admins = new ArrayList<>();
        String[][] adminData = {
            {"Ameena Shaikh", "ameena.shaikh@mentorlink.com"},
            {"John Anderson", "john.anderson@mentorlink.com"},
            {"Sarah Williams", "sarah.williams@mentorlink.com"}
        };

        for (String[] data : adminData) {
            User user = new User();
            user.setName(data[0]);
            user.setEmail(data[1]);
            user.setPasswordHash("hashed_password_123"); // In production, use proper password hashing
            user.setCreatedAt(LocalDateTime.now().minusMonths(6));
            user.setUpdatedAt(LocalDateTime.now());
            admins.add(userRepository.save(user));
        }
        return admins;
    }

    private List<User> createMentors() {
        List<User> mentors = new ArrayList<>();
        String[][] mentorData = {
            {"Henry Carter", "henry.carter@example.com"},
            {"Sarah Wilson", "sarah.wilson@example.com"},
            {"Mike Ross", "mike.ross@example.com"},
            {"Emily Chen", "emily.chen@example.com"},
            {"David Kumar", "david.kumar@example.com"},
            {"Lisa Anderson", "lisa.anderson@example.com"},
            {"James Taylor", "james.taylor@example.com"},
            {"Maria Garcia", "maria.garcia@example.com"},
            {"Robert Johnson", "robert.johnson@example.com"},
            {"Jennifer Lee", "jennifer.lee@example.com"},
            {"Michael Brown", "michael.brown@example.com"},
            {"Patricia Martinez", "patricia.martinez@example.com"}
        };

        for (String[] data : mentorData) {
            User user = new User();
            user.setName(data[0]);
            user.setEmail(data[1]);
            user.setPasswordHash("hashed_password_123");
            user.setCreatedAt(LocalDateTime.now().minusMonths(4));
            user.setUpdatedAt(LocalDateTime.now());
            mentors.add(userRepository.save(user));
        }
        return mentors;
    }

    private List<User> createMentees() {
        List<User> mentees = new ArrayList<>();
        String[][] menteeData = {
            {"Jane Smith", "jane.smith@example.com"},
            {"Alice Johnson", "alice.johnson@example.com"},
            {"Bob Wilson", "bob.wilson@example.com"},
            {"Charlie Brown", "charlie.brown@example.com"},
            {"Diana Prince", "diana.prince@example.com"},
            {"Ethan Hunt", "ethan.hunt@example.com"},
            {"Fiona Apple", "fiona.apple@example.com"},
            {"George Lucas", "george.lucas@example.com"},
            {"Hannah Montana", "hannah.montana@example.com"},
            {"Ivan Drago", "ivan.drago@example.com"},
            {"Julia Roberts", "julia.roberts@example.com"},
            {"Kevin Hart", "kevin.hart@example.com"},
            {"Laura Palmer", "laura.palmer@example.com"},
            {"Mark Zuckerberg", "mark.zuck@example.com"},
            {"Nancy Drew", "nancy.drew@example.com"},
            {"Oliver Twist", "oliver.twist@example.com"},
            {"Pam Beesly", "pam.beesly@example.com"},
            {"Quinn Fabray", "quinn.fabray@example.com"},
            {"Rachel Green", "rachel.green@example.com"},
            {"Sam Winchester", "sam.winchester@example.com"}
        };

        for (String[] data : menteeData) {
            User user = new User();
            user.setName(data[0]);
            user.setEmail(data[1]);
            user.setPasswordHash("hashed_password_123");
            user.setCreatedAt(LocalDateTime.now().minusMonths(3));
            user.setUpdatedAt(LocalDateTime.now());
            mentees.add(userRepository.save(user));
        }
        return mentees;
    }

    private List<Batch> createBatches(List<User> admins) {
        List<Batch> batches = new ArrayList<>();
        
        Batch batch1 = new Batch();
        batch1.setBatchName("Interns 2026");
        batch1.setStartDate(LocalDate.of(2026, 1, 1));
        batch1.setEndDate(LocalDate.of(2026, 6, 30));
        batch1.setManager(admins.get(0));
        batches.add(batchRepository.save(batch1));

        Batch batch2 = new Batch();
        batch2.setBatchName("Interns 2025");
        batch2.setStartDate(LocalDate.of(2025, 7, 1));
        batch2.setEndDate(LocalDate.of(2025, 12, 31));
        batch2.setManager(admins.get(1));
        batches.add(batchRepository.save(batch2));

        Batch batch3 = new Batch();
        batch3.setBatchName("Graduate Trainees 2026");
        batch3.setStartDate(LocalDate.of(2026, 2, 1));
        batch3.setEndDate(LocalDate.of(2026, 8, 31));
        batch3.setManager(admins.get(2));
        batches.add(batchRepository.save(batch3));

        Batch batch4 = new Batch();
        batch4.setBatchName("Advanced Learners 2026");
        batch4.setStartDate(LocalDate.of(2026, 1, 15));
        batch4.setEndDate(LocalDate.of(2026, 7, 15));
        batch4.setManager(admins.get(0));
        batches.add(batchRepository.save(batch4));

        return batches;
    }

    private void assignUserRoles(List<User> users, Role role, List<Batch> batches) {
        Random random = new Random();
        for (User user : users) {
            // Assign to 1-2 random batches
            int numBatches = random.nextInt(2) + 1;
            Set<Batch> assignedBatches = new HashSet<>();
            
            while (assignedBatches.size() < numBatches && assignedBatches.size() < batches.size()) {
                Batch batch = batches.get(random.nextInt(batches.size()));
                assignedBatches.add(batch);
            }

            for (Batch batch : assignedBatches) {
                UserRole userRole = new UserRole();
                UserRoleId id = new UserRoleId(user.getUserId(), role.getRoleId(), batch.getBatchId());
                userRole.setId(id);
                userRole.setUser(user);
                userRole.setRole(role);
                userRole.setBatch(batch);
                userRoleRepository.save(userRole);
            }
        }
    }

    private List<MentorProfile> createMentorProfiles(List<User> mentors, List<Skill> skills) {
        List<MentorProfile> profiles = new ArrayList<>();
        Random random = new Random();

        String[] headlines = {
            "Senior Software Engineer with 8+ years of experience",
            "Full Stack Developer passionate about mentoring",
            "Tech Lead specializing in Cloud Architecture",
            "UI/UX Expert with a focus on accessibility",
            "DevOps Engineer with enterprise experience",
            "Data Scientist with ML expertise",
            "Mobile Development Specialist",
            "Security Expert and Ethical Hacker",
            "Frontend Architect with React expertise",
            "Backend Developer specializing in Java/Spring",
            "System Design Expert",
            "Agile Coach and Scrum Master"
        };

        String[] expertiseAreas = {
            "Web Development", "Mobile Development", "Cloud Computing", "Data Science",
            "Machine Learning", "DevOps", "UI/UX Design", "Cybersecurity",
            "System Architecture", "Database Design", "API Development", "Testing"
        };

        String[] availabilities = {
            "Weekday Evenings", "Weekends Only", "Flexible Schedule",
            "Monday & Wednesday", "Tuesday & Thursday", "Friday Afternoons"
        };

        for (int i = 0; i < mentors.size(); i++) {
            MentorProfile profile = new MentorProfile();
            profile.setUser(mentors.get(i));
            profile.setHeadline(headlines[i % headlines.length]);
            profile.setExperienceYears(random.nextInt(12) + 3); // 3-15 years
            profile.setExpertiseArea(expertiseAreas[i % expertiseAreas.length]);
            profile.setLinkedinUrl("https://linkedin.com/in/" + mentors.get(i).getEmail().split("@")[0]);
            profile.setAvailability(availabilities[i % availabilities.length]);

            // Assign 3-7 random skills
            Set<Skill> mentorSkills = new HashSet<>();
            int numSkills = random.nextInt(5) + 3;
            while (mentorSkills.size() < numSkills) {
                mentorSkills.add(skills.get(random.nextInt(skills.size())));
            }
            profile.setSkills(mentorSkills);

            profiles.add(mentorProfileRepository.save(profile));
        }
        return profiles;
    }

    private List<MenteeProfile> createMenteeProfiles(List<User> mentees, List<Skill> skills) {
        List<MenteeProfile> profiles = new ArrayList<>();
        Random random = new Random();

        String[] currentRoles = {
            "Software Engineering Intern", "Junior Developer", "Graduate Trainee",
            "Associate Developer", "QA Intern", "Data Analyst Intern",
            "UI/UX Intern", "DevOps Trainee", "Product Analyst", "Business Analyst Intern"
        };

        String[] educations = {
            "B.Tech in Computer Science - MIT", "B.E. in Information Technology - Stanford",
            "M.Sc. in Data Science - UC Berkeley", "B.Tech in Electronics - IIT Delhi",
            "BCA - Delhi University", "M.Tech in AI - Carnegie Mellon",
            "B.S. in Computer Engineering - Georgia Tech", "B.Sc. in Software Engineering - Waterloo"
        };

        String[] goals = {
            "Become a proficient full-stack developer",
            "Master cloud technologies and DevOps practices",
            "Build expertise in machine learning and AI",
            "Develop strong system design skills",
            "Transition into a leadership role",
            "Specialize in mobile app development",
            "Become an expert in database architecture",
            "Learn advanced frontend frameworks and best practices"
        };

        String[] interests = {
            "Web Development, Open Source, Chess",
            "Mobile Apps, Gaming, Photography",
            "Data Science, Reading, Hiking",
            "Cloud Computing, Travel, Cooking",
            "UI/UX Design, Art, Music",
            "DevOps, Automation, Cycling",
            "Machine Learning, Research, Tennis",
            "Backend Development, Sports, Movies"
        };

        for (int i = 0; i < mentees.size(); i++) {
            MenteeProfile profile = new MenteeProfile();
            profile.setUser(mentees.get(i));
            profile.setCurrentRole(currentRoles[i % currentRoles.length]);
            profile.setEducation(educations[i % educations.length]);
            profile.setGoals(goals[i % goals.length]);
            profile.setInterests(interests[i % interests.length]);

            // Assign 2-5 random skills to learn
            Set<Skill> menteeSkills = new HashSet<>();
            int numSkills = random.nextInt(4) + 2;
            while (menteeSkills.size() < numSkills) {
                menteeSkills.add(skills.get(random.nextInt(skills.size())));
            }
            profile.setSkills(menteeSkills);

            profiles.add(menteeProfileRepository.save(profile));
        }
        return profiles;
    }

    private List<MentorMenteeMap> createMentorMenteeMappings(
            List<MentorProfile> mentors, List<MenteeProfile> mentees, List<Batch> batches) {
        List<MentorMenteeMap> mappings = new ArrayList<>();
        Random random = new Random();

        String[] statuses = {"ACTIVE", "ACTIVE", "ACTIVE", "APPROVED", "REQUESTED"};
        String[] focusAreas = {
            "Java Development", "React & Frontend", "Spring Boot", "Data Structures",
            "System Design", "AWS Cloud", "DevOps Practices", "Python Programming",
            "UI/UX Design", "Mobile Development", "Database Design", "API Development"
        };

        // Assign 1-3 mentees to each mentor
        for (MentorProfile mentor : mentors) {
            int numMentees = random.nextInt(3) + 1;
            Set<MenteeProfile> assignedMentees = new HashSet<>();

            while (assignedMentees.size() < numMentees && assignedMentees.size() < mentees.size()) {
                MenteeProfile mentee = mentees.get(random.nextInt(mentees.size()));
                if (!assignedMentees.contains(mentee)) {
                    assignedMentees.add(mentee);

                    MentorMenteeMap mapping = new MentorMenteeMap();
                    mapping.setMentor(mentor);
                    mapping.setMentee(mentee);
                    mapping.setBatch(batches.get(random.nextInt(batches.size())));
                    mapping.setFocusArea(focusAreas[random.nextInt(focusAreas.length)]);
                    mapping.setStatus(statuses[random.nextInt(statuses.length)]);
                    mapping.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(90)));

                    mappings.add(mentorMenteeMapRepository.save(mapping));
                }
            }
        }
        return mappings;
    }

    private List<Task> createTasks(List<MentorMenteeMap> mappings) {
        List<Task> tasks = new ArrayList<>();
        Random random = new Random();

        String[] taskDescriptions = {
            "Complete Java Spring Boot tutorial",
            "Build a REST API with authentication",
            "Create a React component library",
            "Implement unit tests for service layer",
            "Design database schema for e-commerce app",
            "Deploy application to AWS",
            "Refactor legacy code to follow SOLID principles",
            "Create technical documentation",
            "Implement caching with Redis",
            "Build a microservice architecture diagram",
            "Complete algorithm challenge on LeetCode",
            "Write integration tests",
            "Set up CI/CD pipeline",
            "Optimize SQL queries for performance",
            "Create UI mockups in Figma",
            "Implement responsive design",
            "Learn Docker basics and containerize app",
            "Study OAuth 2.0 and implement",
            "Build a real-time chat feature",
            "Complete system design course"
        };

        String[] statuses = {"Completed", "Completed", "IN_PROGRESS", "IN_PROGRESS", "ASSIGNED"};

        // Create 3-6 tasks per mapping
        for (MentorMenteeMap mapping : mappings) {
            int numTasks = random.nextInt(4) + 3;
            for (int i = 0; i < numTasks; i++) {
                Task task = new Task();
                task.setMentorMenteeMap(mapping);
                task.setDescription(taskDescriptions[random.nextInt(taskDescriptions.length)]);
                task.setStatus(statuses[random.nextInt(statuses.length)]);
                task.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
                task.setDueDate(LocalDate.now().plusDays(random.nextInt(30)));
                tasks.add(taskRepository.save(task));
            }
        }
        return tasks;
    }

    private List<Feedback> createFeedback(List<MentorMenteeMap> mappings) {
        List<Feedback> feedbacks = new ArrayList<>();
        Random random = new Random();

        String[] comments = {
            "Excellent mentor! Very patient and knowledgeable.",
            "Great sessions, learned a lot about system design.",
            "Very helpful with code reviews and best practices.",
            "Fantastic mentor who really cares about my growth.",
            "Good mentorship, could use more frequent meetings.",
            "Amazing technical skills and teaching ability.",
            "Very supportive and provides great resources.",
            "Best mentor I've had, highly recommend!",
            "Solid mentorship with clear goals and feedback.",
            "Great at explaining complex concepts simply."
        };

        // Create feedback for ~60% of active mappings
        for (MentorMenteeMap mapping : mappings) {
            if ("ACTIVE".equals(mapping.getStatus()) && random.nextDouble() < 0.6) {
                Feedback feedback = new Feedback();
                feedback.setMentorMenteeMap(mapping);
                feedback.setComments(comments[random.nextInt(comments.length)]);
                feedback.setRating(random.nextInt(2) + 4); // 4 or 5 star rating
                feedback.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
                feedbacks.add(feedbackRepository.save(feedback));
            }
        }
        return feedbacks;
    }
}
