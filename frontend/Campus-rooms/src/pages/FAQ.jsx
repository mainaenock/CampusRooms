import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "For Students",
      questions: [
        {
          question: "How do I find accommodation near my university?",
          answer: "Use our search filters to find properties near your university. You can filter by location, price range, amenities, and more. Simply enter your university name in the search bar to see all available options."
        },
        {
          question: "How do I contact a landlord?",
          answer: "Click on any listing to view details, then use the 'Contact Landlord' button to start a conversation. You can message them directly through our secure messaging system to ask questions or arrange viewings."
        },
        {
          question: "Is it safe to rent through CampusRooms?",
          answer: "Yes, we verify all landlords and properties on our platform. We also provide secure messaging and payment options. Always meet landlords in person and view properties before making any payments."
        },
        {
          question: "What should I look for when viewing a property?",
          answer: "Check the condition of the room, bathroom, and kitchen facilities. Ask about utilities, internet, security, and house rules. Take photos and ask about the lease terms and deposit requirements."
        },
        {
          question: "How do I report a problem with a listing?",
          answer: "Use the flag button on any listing to report issues. You can also contact our support team directly through the contact form or email us at support@campusrooms.co.ke."
        }
      ]
    },
    {
      category: "For Landlords",
      questions: [
        {
          question: "How do I list my property?",
          answer: "Register as a landlord, complete your profile verification, and use our listing form to add your property. Include high-quality photos, detailed descriptions, and accurate pricing information."
        },
        {
          question: "What information should I include in my listing?",
          answer: "Include clear photos, detailed descriptions, exact location, rent amount, available amenities, house rules, and contact information. The more detailed your listing, the more inquiries you'll receive."
        },
        {
          question: "How do I manage inquiries from students?",
          answer: "You'll receive messages through our platform. Respond promptly, be professional, and provide all necessary information. You can also schedule viewings and answer questions about your property."
        },
        {
          question: "Is there a fee to list my property?",
          answer: "Basic listings are free. We offer premium features for enhanced visibility and better placement in search results. Contact us for more information about premium packages."
        },
        {
          question: "How do I update or remove my listing?",
          answer: "Log into your landlord dashboard to edit listing details, update photos, or remove listings. Changes are reflected immediately on the platform."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Register' button and choose whether you're a student or landlord. Fill in your details, verify your email, and complete your profile to get started."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
        },
        {
          question: "How do I update my profile information?",
          answer: "Go to your profile page and click 'Edit Profile' to update your personal information, contact details, and preferences."
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we use industry-standard encryption and security measures to protect all user data. We never share your personal information with third parties without your consent."
        },
        {
          question: "How do I delete my account?",
          answer: "Contact our support team to request account deletion. We'll guide you through the process and ensure all your data is properly removed."
        }
      ]
    },
    {
      category: "Payments & Fees",
      questions: [
        {
          question: "How do payments work?",
          answer: "We support M-Pesa payments for deposits and rent. Payments are processed securely through our platform, and you'll receive confirmation once completed."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees. All charges are clearly displayed before you make any payments. We're transparent about our pricing structure."
        },
        {
          question: "What if a payment fails?",
          answer: "If a payment fails, check your M-Pesa balance and try again. If the problem persists, contact our support team for assistance."
        },
        {
          question: "Can I get a refund?",
          answer: "Refund policies depend on the specific circumstances. Contact our support team with your refund request, and we'll review it on a case-by-case basis."
        },
        {
          question: "How do I view my payment history?",
          answer: "Go to your profile page and click on 'Payment History' to view all your past transactions and payment records."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "The website isn't loading properly. What should I do?",
          answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the problem persists, contact our technical support team."
        },
        {
          question: "I can't upload photos to my listing. Help!",
          answer: "Ensure your photos are in JPG or PNG format and under 5MB each. If you're still having issues, try using a different browser or contact support."
        },
        {
          question: "Messages aren't sending. What's wrong?",
          answer: "Check your internet connection and try refreshing the page. If the problem continues, contact our support team for assistance."
        },
        {
          question: "How do I enable notifications?",
          answer: "Go to your profile settings and enable email and push notifications to stay updated on new messages and listing updates."
        },
        {
          question: "The search filters aren't working. Help!",
          answer: "Try clearing your browser cache or using a different browser. If the issue persists, contact our technical support team for assistance."
        }
      ]
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FaQuestionCircle className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">FAQ</h1>
              <p className="text-gray-500 dark:text-gray-400">Frequently Asked Questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQ.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{category.category}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const itemIndex = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openItems.has(itemIndex);
                    
                    return (
                      <div key={questionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <span className="font-semibold text-gray-800 dark:text-white pr-4">
                            {item.question}
                          </span>
                          {isOpen ? (
                            <FaChevronUp className="text-gray-500 flex-shrink-0" />
                          ) : (
                            <FaChevronDown className="text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <Link
              to="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 