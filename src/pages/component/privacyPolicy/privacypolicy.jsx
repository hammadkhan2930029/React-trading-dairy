import React, { useEffect } from 'react';
import './privacyPolicy.css';
import { Nav } from '../nav/nav';
import { New_breadCrumbs } from '../newCrumbs/newcrumbs';
import { Footer } from '../footer/footer';


export const PrivacyPolicy = () => {
    const effectiveDate = 'October 13, 2025'; // demo date
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className="privacy-container-main">
            <Nav />
            <div className='breadCrumbs_div'>
                <New_breadCrumbs />
            </div>
            <main className="privacy-container">
                <header className="policy-header">
                    <h1>Privacy Policy</h1>
                    <p className="effective-date">Effective date: {effectiveDate}</p>
                </header>


                <section className="policy-section">
Cogent Devs (“we”, “our”, “us”) is committed to protecting the privacy of users (“you”, “your”) who access and use the Trading Diary platform (“the Platform”). This Privacy Policy explains how we collect, use, store, and protect your information.
1. Information We Collect
We may collect the following types of information:
a. Personal Information
•	Name
•	Email address
•	Contact details
•	Account login credentials
b. Trading & Usage Data
•	Trade entries recorded by the user
•	Portfolio-related data entered manually
•	Notes, tags, and journal entries
•	Platform usage logs and activity history
c. Technical Information
•	IP address
•	Device type and browser information
•	Operating system
•	Log files and usage analytics
2. How We Use Your Information
We use collected information to:
•	Provide and operate the Platform
•	Maintain user accounts and authentication
•	Improve platform performance and features
•	Analyze usage patterns for product improvement
•	Communicate service-related updates
•	Ensure security, fraud prevention, and compliance
We do not use your data to provide investment advice or trading signals.
3. Data Storage and Security
•	User data is stored using industry-standard security practices
•	Access is restricted and role-based
•	We apply reasonable technical and organizational safeguards to protect data from unauthorized access, loss, or misuse
Despite our best efforts, no system can guarantee 100% security.
4. Data Sharing and Disclosure
We do not sell, rent, or trade user data.
Data may be shared only:
•	With trusted service providers for hosting or infrastructure support
•	When required by law, regulation, or court order
•	To protect our legal rights or platform security
All third-party service providers are required to maintain confidentiality.
5. Cookies and Tracking
We may use cookies and similar technologies to:
•	Improve user experience
•	Maintain sessions
•	Analyze platform usage
You may disable cookies through your browser settings, though some features may not function properly.
6. User Rights and Control
Users may:
•	Access and update their personal information
•	Request account deletion (subject to legal or operational retention requirements)
•	Control optional notifications and preferences
Requests can be made by contacting us at: [support@yourdomain.com]
7. Third-Party Links
The Platform may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites.
8. Children’s Privacy
The Platform is not intended for individuals under the age of 18. We do not knowingly collect data from minors.
9. Changes to This Policy
We may update this Privacy Policy periodically. Continued use of the Platform after changes indicates acceptance of the revised policy.
10. Contact Information
For questions regarding this Privacy Policy, contact:
Cogent Devs
Email: [support@yourdomain.com]

                </section>

            </main>
            <Footer />
        </div>

    );
};

