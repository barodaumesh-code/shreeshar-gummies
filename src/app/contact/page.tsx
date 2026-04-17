export default function ContactPage() {
  return (
    <div className="page-enter min-h-[70vh]">
      <section className="max-w-3xl mx-auto px-6 lg:px-12 pt-16 pb-24 text-center">
        <div className="divider-label max-w-[180px] mx-auto mb-8">Get in Touch</div>
        <h1 className="font-display text-5xl md:text-7xl italic font-light leading-[0.95] mb-8">
          We'd love to hear <br />
          <span className="text-moss">from you.</span>
        </h1>
        <p className="text-lg text-ink-60 max-w-xl mx-auto leading-relaxed mb-12">
          Questions about a formula? Looking for a wholesale partnership? Just want
          to say hi? Drop us a note.
        </p>

        <form className="text-left space-y-5 bg-cream/50 p-8 md:p-10 rounded-sm">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2">Name</label>
              <input type="text" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2">Email</label>
              <input type="email" required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2">Subject</label>
            <input type="text" className="input-field" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2">Message</label>
            <textarea rows={5} required className="input-field resize-none" />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            Send Message
          </button>
        </form>

        <div className="mt-16 grid sm:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-2 text-ink-60">Support</h4>
            <p className="text-lg">hello@shreeshar.com</p>
          </div>
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-2 text-ink-60">Wholesale</h4>
            <p className="text-lg">wholesale@shreeshar.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
