import { useEffect, useState } from 'react';
import { PRIORITIES, STATUSES } from '../utils/constants';

export default function TaskForm({ task, projects, selectedProject, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    project: selectedProject || '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium',
    status: 'To Do'
  });
  const project = projects.find((item) => item._id === form.project);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || task.project || selectedProject || '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        priority: task.priority || 'Medium',
        status: task.status || 'To Do'
      });
    }
  }, [task, selectedProject]);

  useEffect(() => {
    if (!form.project && projects[0]?._id) {
      setForm((current) => ({
        ...current,
        project: projects[0]._id,
        assignedTo: projects[0].members?.[0]?._id || ''
      }));
    }
  }, [projects, form.project]);

  useEffect(() => {
    if (project && !project.members?.some((member) => member._id === form.assignedTo)) {
      setForm((current) => ({ ...current, assignedTo: project.members?.[0]?._id || '' }));
    }
  }, [project, form.assignedTo]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, assignedTo: form.assignedTo || project?.members?.[0]?._id });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div><label className="label">Title</label><input required className="input mt-1" value={form.title} onChange={(e) => update('title', e.target.value)} /></div>
      <div><label className="label">Description</label><textarea className="input mt-1 min-h-24" value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Project</label><select required className="input mt-1" value={form.project} onChange={(e) => update('project', e.target.value)}>{projects.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}</select></div>
        <div><label className="label">Assign to project member</label><select required className="input mt-1" value={form.assignedTo} onChange={(e) => update('assignedTo', e.target.value)}>{project?.members?.map((member) => <option key={member._id} value={member._id}>{member.name} - {member.email}</option>)}</select></div>
        <div><label className="label">Due date</label><input type="date" className="input mt-1" value={form.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></div>
        <div><label className="label">Priority</label><select className="input mt-1" value={form.priority} onChange={(e) => update('priority', e.target.value)}>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div><label className="label">Status</label><select className="input mt-1" value={form.status} onChange={(e) => update('status', e.target.value)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></div>
      </div>
      <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className="btn-secondary">Cancel</button><button className="btn-primary">Save task</button></div>
    </form>
  );
}
