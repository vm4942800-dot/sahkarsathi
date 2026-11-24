import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Award,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  X
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';
import BackendNotice from '../../components/common/BackendNotice';
import Badge from '../../components/common/Badge';
import { mockSkills, skillCategories } from '../../data/workerMockData';

export default function WorkerSkills() {
  const [skills, setSkills] = useState(mockSkills);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Skill Modal Form State
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: skillCategories[0],
    level: 'Skilled Craftsman',
    experience: '2 Years',
    description: '',
    certificationName: '',
  });

  const [feedback, setFeedback] = useState(null);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.description.trim()) {
      alert('Please fill out the skill name and description.');
      return;
    }

    const created = {
      id: `skl-${Date.now()}`,
      name: newSkill.name,
      category: newSkill.category,
      level: newSkill.level,
      experience: newSkill.experience,
      isCertified: Boolean(newSkill.certificationName.trim()),
      certificationName: newSkill.certificationName.trim() || 'Self-Reported (Pending Assessment)',
      description: newSkill.description,
    };

    setSkills([created, ...skills]);
    setShowAddModal(false);
    setNewSkill({
      name: '',
      category: skillCategories[0],
      level: 'Skilled Craftsman',
      experience: '2 Years',
      description: '',
      certificationName: '',
    });

    setFeedback({
      type: 'success',
      message: `Skill "${created.name}" added successfully. Scheduled for supervisor audit.`,
    });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRemoveSkill = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your active skill trades?`)) {
      setSkills(skills.filter((s) => s.id !== id));
      setFeedback({
        type: 'info',
        message: `Skill "${name}" removed from your profile.`,
      });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <WorkerLayout>
      <div className="space-y-6 max-w-5xl">
        <BackendNotice
          title="Trade Skills Management & Certification Standards"
          message="Skills listed here determine which job requests are dispatched to your terminal. Skills backed by NABL or State Directorate certificates receive 'Verified Certified' tags after supervisor verification."
        />

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-brand-bgSecondary text-brand-primary border border-brand-border'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header & Add Action */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="teal" size="sm">
                Active Skill Trades: {skills.length}
              </Badge>
              <span className="text-xs text-brand-secondary font-mono">
                {skills.filter((s) => s.isCertified).length} Certified
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brand-primary">
              My Service Skills & Credentials
            </h1>
            <p className="text-xs sm:text-sm text-brand-secondary max-w-xl mt-1">
              Configure the exact trades, equipment specializations, and electrical/civil services you provide.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-teal text-white hover:bg-brand-teal/90 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Skill</span>
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-secondary" />
            <input
              type="text"
              placeholder="Search active skills or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs text-brand-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-brand-secondary flex-shrink-0">
              Filter by:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border text-xs text-brand-primary bg-white outline-none focus:ring-2 focus:ring-brand-teal"
            >
              <option value="All">All Categories</option>
              {skillCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              layout
              className="bg-white rounded-2xl p-5 border border-brand-border hover:border-brand-teal/40 transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary px-2 py-0.5 rounded bg-brand-bgSecondary border border-brand-border">
                      {skill.category}
                    </span>
                    <h3 className="font-display font-bold text-base text-brand-primary mt-1.5">
                      {skill.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id, skill.name)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-brand-secondary mt-2 leading-relaxed">
                  {skill.description}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-border/60 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-brand-primary bg-brand-bgSecondary/80 px-2.5 py-1 rounded-lg">
                    Level: {skill.level}
                  </span>
                  <span className="text-xs text-brand-secondary bg-brand-bgSecondary/80 px-2.5 py-1 rounded-lg">
                    Exp: {skill.experience}
                  </span>
                </div>
              </div>

              {/* Certification Badge */}
              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                {skill.isCertified ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-[11px] truncate">
                      {skill.certificationName}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="font-medium text-[11px]">
                      Self-Reported • Verification Pending
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
            <Wrench className="w-10 h-10 text-brand-secondary mx-auto opacity-50" />
            <h3 className="font-display font-bold text-lg text-brand-primary">
              No Matching Skills Found
            </h3>
            <p className="text-xs text-brand-secondary max-w-sm mx-auto">
              Try adjusting your search query or category filter, or click "Add New Skill" to register another trade.
            </p>
          </div>
        )}

        {/* Add Skill Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-brand-border z-10"
              >
                <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-brand-primary">
                      Add New Service Trade
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-black/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSkill} className="pt-4 space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Skill or Specialization Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Copper Pipe Brazing & Hydrostatic Pressure Testing"
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs sm:text-sm outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Category *
                      </label>
                      <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs outline-none bg-white"
                      >
                        {skillCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-primary mb-1">
                        Proficiency Level *
                      </label>
                      <select
                        value={newSkill.level}
                        onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs outline-none bg-white"
                      >
                        <option value="Apprentice">Apprentice (Under Supervision)</option>
                        <option value="Skilled Craftsman">Skilled Craftsman (Independent)</option>
                        <option value="Master Artisan">Master Artisan (Team Lead)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Experience in this Trade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Years"
                      value={newSkill.experience}
                      onChange={(e) => setNewSkill({ ...newSkill, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Certification / License Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ITI Plumber License / NABL Grade-B"
                      value={newSkill.certificationName}
                      onChange={(e) => setNewSkill({ ...newSkill, certificationName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs outline-none"
                    />
                    <p className="text-[10px] text-brand-secondary mt-1">
                      Self-reported certificates remain subject to supervisor verification before earning a verified badge.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-primary mb-1">
                      Trade Description & Equipment Used *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the tasks you can execute, testing meters used, and safety precautions observed..."
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-teal text-xs outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="pt-3 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-xs font-semibold text-brand-secondary transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      Save & Register Skill
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </WorkerLayout>
  );
}
