
const getColorForMenuItem = (name) => {
  const colors = {
    'Profile': '#432323',   
    'Registraion Card': '#0685caff',   
    'Admit Card': '#a89eff',   
    'FeeReceipt': '#E67E22',  
    'Syllabus': '#FE4F2D',  
    'Transcript': '#d76f00ff',  
    'Notification': '#00aae8ff',   
    'Complaint': '#930000ff',   
  };
  
  return colors[name] || '#ffffff';   
};


export const pathshalaMenu = [

    {
    id: 1,
    name: 'Profile',
    iconLib: 'FontAwesome6',
    icon: 'user',
    screen: 'Profile',
    color: getColorForMenuItem('Profile'),
    data: ''
  },
  {
    id: 2,
    name: 'Registraion Card',
    iconLib: 'FontAwesome6',
    icon: 'users',
    screen: 'RegistraionCardList',
    color: getColorForMenuItem('Registraion Card'),
  },
  {
    id: 3,
    name: 'Admit Card',
    iconLib: 'FontAwesome6',
    icon: 'ticket',
    screen: 'AdmitCard',
    color: getColorForMenuItem('Admit Card'),
  },
  {
    id: 4,
    name: 'Fee Receipt',
    iconLib: 'FontAwesome6',
    icon: 'file-invoice-dollar',
    screen: 'FeeReceipt',
    color: getColorForMenuItem('FeeReceipt'),    
  },
  



  // {
  //   id: 3,
  //   name: 'Doubt Session',
  //   icon: 'comments',
  //   screen: 'DoubtSession',
  //   color: '#ffb84d',  
  // },
  // {
  //   id: 4,
  //   name: 'Video Lecture',
  //   icon: 'video',
  //   screen: 'Examination',
  //   color: '#b76bcc',  
  // },
  // {
  //   id: 5,
  //   name: 'Examination',
  //   icon: 'clipboard-check',
  //   screen: 'Examination',
  //   color: '#f66c6b',  
  // },


];




export const studentMenu = [
  // {
  //   id: 1,
  //   name: 'Profile',
  //   iconLib: 'FontAwesome6',
  //   icon: 'user',
  //   screen: 'Profile',
  //   color: getColorForMenuItem('Profile'),
  //   data: ''
  // },
  // {
  //   id: 3,
  //   name: 'Admit Card',
  //   iconLib: 'FontAwesome6',
  //   icon: 'ticket',
  //   screen: 'AdmitCard',
  //   color: getColorForMenuItem('Admit Card'),
  // },
  // {
  //   id: 4,
  //   name: 'FeeReceipt',
  //   iconLib: 'FontAwesome6',
  //   icon: 'file-invoice-dollar',
  //   screen: 'FeeReceipt',
  //   color: getColorForMenuItem('FeeReceipt'),
  // },

  
  // {
  //   id: 6,
  //   name: 'Assignment',
  //   icon: 'file-pen',
  //   screen: 'Assignment',
  //   color: '#8cd9a2',  
  // },

  //   {
  //   id: 7,
  //   name: 'Registraion Card',
  //   iconLib: 'FontAwesome6',
  //   icon: 'users',
  //   screen: 'RegistraionCardList',
  //   color: getColorForMenuItem('Registraion Card'),
  // },
  // {
  //   id: 8,
  //   name: 'Transcript',
  //   iconLib: 'FontAwesome6',
  //   icon: 'file-alt',
  //   screen: 'Transcript',
  //   color: getColorForMenuItem('Transcript'),
  // },
  // {
  //   id: 9,
  //   name: 'Syllabus',
  //   iconLib: 'FontAwesome6',
  //   icon: 'book-open',
  //   screen: 'Syllabus',
  //   color: getColorForMenuItem('Syllabus'),
  // },
  {
    id: 10,
    name: 'Complaint',
    iconLib: 'FontAwesome6',
    icon: 'graduation-cap',
    screen: 'ComplaintScreen',
    color: getColorForMenuItem('Complaint'),
  },
  {
    id: 10,
    name: 'SRC',
    iconLib: 'FontAwesome6',
    icon: 'graduation-cap',
    screen: 'SRC',
    color: getColorForMenuItem('Complaint'),
  },

   
];
