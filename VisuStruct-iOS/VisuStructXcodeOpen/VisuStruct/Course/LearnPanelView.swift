import SwiftUI
import VisuStructCore

// MARK: - Lern-Spalte

/// Lernbereich neben dem Editor (iPad, Mac) bzw. als Blatt (iPhone): Lektionen Schritt für Schritt und Aufgaben.
/// Lektion 1 bis 3 sind frei, der Rest gehört zum Kurs (`CourseStore`).
struct LearnPanelView: View {
    @Environment(\.appLanguage) private var lang
    @ObservedObject private var progress = CourseProgress.shared
    @ObservedObject private var store = CourseStore.shared
    let host: LearnHost
    let onClose: () -> Void

    private enum Area: Hashable {
        case lessons, tasks
    }

    private struct LessonGroup: Identifiable {
        let name: String
        var lessons: [CourseLesson]
        var id: String { name }
    }

    @State private var section: Area = .lessons
    @State private var lessonID: String?
    @State private var taskID: String?
    @State private var restored = false

    var body: some View {
        Group {
            if let content = CourseLibrary.content(for: lang) {
                VStack(spacing: 0) {
                    header(content)
                    Divider()
                    if section == .lessons, let lesson = content.lessons.first(where: { $0.id == lessonID }) {
                        LearnLessonView(lesson: lesson, content: content, host: host, unlocked: store.isUnlocked) {
                            lessonID = nil
                            progress.openLesson = nil
                        } onOpenLesson: { next in
                            lessonID = next
                            progress.openLesson = next
                        }
                        .id(lesson.id)
                    } else if section == .tasks, let task = content.tasks.first(where: { $0.id == taskID }) {
                        LearnTaskView(task: task, content: content, host: host, unlocked: store.isUnlocked) {
                            taskID = nil
                            progress.openTask = nil
                        }
                        .id(task.id)
                    } else if section == .lessons {
                        lessonList(content)
                    } else {
                        taskList(content)
                    }
                }
            } else {
                ContentUnavailableView("VisuStruct", systemImage: "book.closed")
            }
        }
        .background(Color(.systemGroupedBackground))
        .onAppear {
            guard !restored else { return }
            restored = true
            lessonID = progress.openLesson
            taskID = progress.openTask
        }
    }

    private func header(_ content: CourseContent) -> some View {
        HStack(spacing: 10) {
            Label(content.t("title"), systemImage: "graduationcap")
                .font(.headline)
            Spacer(minLength: 4)
            Picker("", selection: $section) {
                Text(content.t("lessons")).tag(Area.lessons)
                Text(content.t("tasks")).tag(Area.tasks)
            }
            .pickerStyle(.segmented)
            .fixedSize()
            Button(action: onClose) {
                Image(systemName: "xmark.circle.fill")
                    .symbolRenderingMode(.hierarchical)
                    .font(.title3)
            }
            .buttonStyle(.plain)
            .foregroundStyle(.secondary)
            .accessibilityLabel(content.t("app_close"))
            .help(content.t("app_close"))
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
    }

    private func lessonList(_ content: CourseContent) -> some View {
        let groups = content.lessons.reduce(into: [LessonGroup]()) { result, lesson in
            if result.last?.name == lesson.section {
                result[result.count - 1].lessons.append(lesson)
            } else {
                result.append(LessonGroup(name: lesson.section, lessons: [lesson]))
            }
        }
        return List {
            if !store.isUnlocked {
                SwiftUI.Section {
                    unlockRow(content, text: content.t("app_free_note"))
                }
            }
            ForEach(groups) { group in
                SwiftUI.Section(group.name) {
                    ForEach(group.lessons) { lesson in
                        Button {
                            lessonID = lesson.id
                            progress.openLesson = lesson.id
                        } label: {
                            lessonRow(lesson, content: content)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
    }

    private func lessonRow(_ lesson: CourseLesson, content: CourseContent) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Text("\(lesson.number)")
                .font(.callout.weight(.semibold).monospacedDigit())
                .frame(width: 26, alignment: .trailing)
                .foregroundStyle(.secondary)
            VStack(alignment: .leading, spacing: 2) {
                Text(lesson.title).font(.body.weight(.medium))
                Text(LearnInlineText.attributed(lesson.summary))
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
            Spacer(minLength: 4)
            if progress.lesson(lesson.id).done {
                Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
            } else if CourseLibrary.isLocked(lesson: lesson, unlocked: store.isUnlocked) {
                Image(systemName: "lock.fill").foregroundStyle(.secondary)
            }
        }
        .contentShape(Rectangle())
    }

    private func taskList(_ content: CourseContent) -> some View {
        List {
            SwiftUI.Section {
                Text(content.t("tasks_intro"))
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
            ForEach(content.tasks) { task in
                Button {
                    taskID = task.id
                    progress.openTask = task.id
                } label: {
                    HStack(alignment: .top, spacing: 10) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(task.title).font(.body.weight(.medium))
                            HStack(spacing: 8) {
                                if let after = task.after, let lesson = content.lessons.first(where: { $0.number == after }) {
                                    Text(content.t("after_fmt", after, lesson.title))
                                }
                                Text(String(repeating: "★", count: task.level) + String(repeating: "☆", count: max(0, 3 - task.level)))
                                    .accessibilityLabel(content.t("level_fmt", task.level))
                            }
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        }
                        Spacer(minLength: 4)
                        if CourseLibrary.isLocked(task: task, unlocked: store.isUnlocked) {
                            Image(systemName: "lock.fill").foregroundStyle(.secondary)
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
        }
        .listStyle(.insetGrouped)
    }

    private func unlockRow(_ content: CourseContent, text: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(text).font(.callout)
            Button {
                host.showCourseStore()
            } label: {
                Label(content.t("app_unlock"), systemImage: "lock.open")
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Gesperrt

struct LearnLockedView: View {
    let content: CourseContent
    let text: String
    let host: LearnHost

    var body: some View {
        VStack(spacing: 14) {
            Image(systemName: "lock.fill")
                .font(.largeTitle)
                .foregroundStyle(.secondary)
            Text(text)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
            Button {
                host.showCourseStore()
            } label: {
                Label(content.t("app_unlock"), systemImage: "lock.open")
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Lektion

struct LearnLessonView: View {
    @ObservedObject private var progress = CourseProgress.shared
    let lesson: CourseLesson
    let content: CourseContent
    let host: LearnHost
    let unlocked: Bool
    let onBack: () -> Void
    let onOpenLesson: (String) -> Void

    @State private var step = 0

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onBack) {
                    Label(content.t("all_lessons"), systemImage: "chevron.backward")
                }
                .buttonStyle(.borderless)
                Spacer()
                if progress.lesson(lesson.id).done {
                    Label(content.t("done"), systemImage: "checkmark.circle.fill")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.green)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)

            if CourseLibrary.isLocked(lesson: lesson, unlocked: unlocked) {
                ScrollView {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(content.t("lesson_fmt", lesson.number)).font(.caption).foregroundStyle(.secondary)
                        Text(lesson.title).font(.title2.weight(.semibold))
                        LearnInlineText(markdown: lesson.summary).foregroundStyle(.secondary)
                        LearnLockedView(content: content, text: content.t("app_locked"), host: host)
                    }
                    .padding(16)
                }
            } else {
                stepView
                Divider()
                navigation
            }
        }
        .onAppear {
            step = min(progress.lesson(lesson.id).step, lesson.steps.count - 1)
        }
    }

    private var stepView: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(content.t("lesson_fmt", lesson.number)) · \(content.t("step_of_fmt", step + 1, lesson.steps.count))")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        Text(lesson.title).font(.title3.weight(.semibold))
                    }
                    .id("top")
                    Text(lesson.steps[step].title)
                        .font(.title2.weight(.bold))
                        .fixedSize(horizontal: false, vertical: true)
                    ForEach(Array(lesson.steps[step].blocks.enumerated()), id: \.offset) { index, block in
                        LearnBlockView(
                            block: block,
                            context: LearnBlockContext(
                                content: content,
                                host: host,
                                lessonID: lesson.id,
                                key: "\(step)-\(index)",
                                goToStep: { goTo($0) }
                            )
                        )
                    }
                }
                .padding(16)
                .frame(maxWidth: 720, alignment: .leading)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .onChange(of: step) { _, _ in
                proxy.scrollTo("top", anchor: .top)
            }
        }
    }

    private var isLastStep: Bool { step >= lesson.steps.count - 1 }

    private var nextLesson: CourseLesson? {
        content.lessons.first { $0.number > lesson.number }
    }

    private var navigation: some View {
        HStack(spacing: 10) {
            Button {
                goTo(step - 1)
            } label: {
                Label(content.t("back"), systemImage: "chevron.backward")
            }
            .buttonStyle(.bordered)
            .disabled(step == 0)
            Spacer()
            ProgressView(value: Double(step + 1), total: Double(lesson.steps.count))
                .frame(maxWidth: 120)
            Spacer()
            if isLastStep {
                if progress.lesson(lesson.id).done, let next = nextLesson {
                    Button {
                        onOpenLesson(next.id)
                    } label: {
                        Label(content.t("lesson_fmt", next.number), systemImage: "chevron.forward")
                    }
                    .buttonStyle(.borderedProminent)
                } else {
                    Button {
                        progress.updateLesson(lesson.id) { $0.done = true }
                    } label: {
                        Label(content.t("finish"), systemImage: "checkmark")
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(progress.lesson(lesson.id).done)
                }
            } else {
                Button {
                    goTo(step + 1)
                } label: {
                    Label(content.t("next"), systemImage: "chevron.forward")
                        .labelStyle(.titleAndIcon)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
    }

    private func goTo(_ index: Int) {
        let clamped = max(0, min(index, lesson.steps.count - 1))
        step = clamped
        progress.updateLesson(lesson.id) { $0.step = max($0.step, clamped) }
    }
}

// MARK: - Aufgabe

struct LearnTaskView: View {
    let task: CourseTask
    let content: CourseContent
    let host: LearnHost
    let unlocked: Bool
    let onBack: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Button(action: onBack) {
                    Label(content.t("all_tasks"), systemImage: "chevron.backward")
                }
                .buttonStyle(.borderless)
                Spacer()
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    Text(task.title).font(.title2.weight(.bold))
                    if CourseLibrary.isLocked(task: task, unlocked: unlocked) {
                        LearnLockedView(content: content, text: content.t("app_tasks_locked"), host: host)
                    } else {
                        ForEach(Array(task.blocks.enumerated()), id: \.offset) { index, block in
                            LearnBlockView(
                                block: block,
                                context: LearnBlockContext(content: content, host: host, lessonID: nil, key: "\(index)")
                            )
                        }
                    }
                }
                .padding(16)
                .frame(maxWidth: 720, alignment: .leading)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }
}
