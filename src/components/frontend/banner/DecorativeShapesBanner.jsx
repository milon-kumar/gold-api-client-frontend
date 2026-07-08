
import React from 'react';
import { motion } from 'framer-motion';

export default function GeometricBanner({message}) {
    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-[hsl(172,66%,35%)] via-[hsl(172,66%,40%)] to-[hsl(172,66%,45%)]">            {/* Triangle pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L20 20 L40 0 Z M0 40 L20 20 L40 40 Z' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
            }} />

            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/20 rounded-tl-3xl" />
                <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/20 rounded-bl-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/20 rounded-br-3xl" />
            </div>

            {/* Animated shine */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-6 bg-white/50 rounded-full" />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide"
                    >
                        {message}
                    </motion.p>
                    <div className="w-1 h-6 bg-white/50 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// import React from 'react';
// import { motion } from 'framer-motion';

// export default function MinimalPrimaryBanner() {
//     return (
//         <div className="relative w-full overflow-hidden" style={{ backgroundColor: 'hsl(172, 66%, 40%)' }}>
//             {/* Subtle pattern */}
//             <div className="absolute inset-0 opacity-5" style={{
//                 backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
//                 backgroundSize: '32px 32px'
//             }} />

//             {/* Single decorative circle */}
//             <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
//             <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

//             {/* Center glow */}
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-16 rounded-full bg-white/10 blur-xl" />

//             {/* Animated border bottom */}
//             <motion.div
//                 className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
//                 animate={{ scaleX: [0, 1, 0] }}
//                 transition={{ duration: 3, repeat: Infinity }}
//             />

//             {/* Content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
//                 <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     whileHover={{ scale: 1.01 }}
//                     className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide"
//                 >
//                     দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                 </motion.p>
//             </div>

//             {/* Animated border top */}
//             <motion.div
//                 className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
//                 animate={{ scaleX: [1, 0, 1] }}
//                 transition={{ duration: 3, repeat: Infinity }}
//             />
//         </div>
//     );
// }



// import React from 'react';
// import { motion } from 'framer-motion';

// export default function GeometricBannerWithCSSVar() {
//     return (
//         <div
//             className="relative w-full overflow-hidden"
//             style={{
//                 background: `linear-gradient(135deg, hsl(172, 66%, 35%), hsl(172, 66%, 40%), hsl(172, 66%, 45%))`
//             }}
//         >
//             {/* Triangle pattern with primary color */}
//             <div className="absolute inset-0 opacity-10" style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L20 20 L40 0 Z M0 40 L20 20 L40 40 Z' fill='hsl(172, 66%25, 40%25)'/%3E%3C/svg%3E")`,
//                 backgroundSize: '30px 30px'
//             }} />

//             {/* Corner decorations */}
//             <div className="absolute top-0 left-0 w-full h-full">
//                 <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/20 rounded-tl-3xl" />
//                 <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20 rounded-tr-3xl" />
//                 <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/20 rounded-bl-3xl" />
//                 <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/20 rounded-br-3xl" />
//             </div>

//             {/* Animated shine */}
//             <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
//                 animate={{ x: ['-100%', '100%'] }}
//                 transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
//             />

//             {/* Content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
//                 <div className="flex items-center justify-center gap-2">
//                     <div className="w-1 h-6 bg-white/50 rounded-full" />
//                     <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide"
//                     >
//                         দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                     </motion.p>
//                     <div className="w-1 h-6 bg-white/50 rounded-full" />
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React from 'react';
// import { motion } from 'framer-motion';

// export default function GeometricBannerV2() {
//     const primaryColor = 'hsl(172, 66%, 40%)';
//     const primaryDarker = 'hsl(172, 66%, 30%)';
//     const primaryLighter = 'hsl(172, 66%, 50%)';
//     const primaryLightest = 'hsl(172, 66%, 60%)';

//     return (
//         <div
//             className="relative w-full overflow-hidden"
//             style={{
//                 background: `linear-gradient(90deg, ${primaryDarker}, ${primaryColor}, ${primaryLighter}, ${primaryColor}, ${primaryDarker})`,
//                 backgroundSize: '200% 100%'
//             }}
//         >
//             {/* Animated gradient background */}
//             <motion.div
//                 className="absolute inset-0"
//                 animate={{ backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
//                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                 style={{
//                     background: `linear-gradient(90deg, ${primaryDarker}, ${primaryColor}, ${primaryLighter}, ${primaryLightest}, ${primaryLighter}, ${primaryColor}, ${primaryDarker})`,
//                     backgroundSize: '300% 100%'
//                 }}
//             />

//             {/* Geometric pattern overlay */}
//             <div className="absolute inset-0 opacity-5" style={{
//                 backgroundImage: `repeating-linear-gradient(45deg, ${primaryColor} 0px, ${primaryColor} 2px, transparent 2px, transparent 8px)`
//             }} />

//             {/* Corner decorations */}
//             <div className="absolute top-0 left-0 w-full h-full">
//                 <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
//                 <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
//                 <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
//                 <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
//             </div>

//             {/* Floating diamond shapes */}
//             <motion.div
//                 className="absolute top-8 left-[15%] w-8 h-8 rotate-45 border border-white/10"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             />
//             <motion.div
//                 className="absolute bottom-8 right-[20%] w-12 h-12 rotate-45 border border-white/10"
//                 animate={{ rotate: -360 }}
//                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//             />

//             {/* Animated shine */}
//             <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
//                 animate={{ x: ['-100%', '100%'] }}
//                 transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
//             />

//             {/* Content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
//                 <div className="flex items-center justify-center gap-4">
//                     <motion.div
//                         className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center"
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                     >
//                         <div className="w-2 h-2 rounded-full bg-white/50" />
//                     </motion.div>

//                     <motion.p
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-semibold tracking-wide drop-shadow-lg"
//                     >
//                         দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                     </motion.p>

//                     <motion.div
//                         className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center"
//                         animate={{ rotate: -360 }}
//                         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
//                     >
//                         <div className="w-2 h-2 rounded-full bg-white/50" />
//                     </motion.div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// import React from 'react';
// import { motion } from 'framer-motion';


// import React from 'react';
// import { motion } from 'framer-motion';

// export default class SingleShapeBanner extends React.Component {
//     render() {
//         return (
//             <div className="relative w-full overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600">
//                 {/* Single large circle overlay */}
//                 <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
//                 <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />

//                 {/* Center glow */}
//                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full bg-white/5 blur-2xl" />

//                 {/* Animated gradient border */}
//                 <div className="absolute inset-0 opacity-30" style={{
//                     background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
//                 }} />

//                 {/* Content */}
//                 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
//                     <motion.p
//                         whileHover={{ scale: 1.01 }}
//                         className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-semibold tracking-wide"
//                     >
//                         দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                     </motion.p>
//                 </div>
//             </div>
//         );
//     }
// }

// import React from 'react';
// import { motion } from 'framer-motion';

// export default function BlobShapeBanner() {
//     return (
//         <div className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600">
//             {/* Blob shapes */}
//             <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
//                 <defs>
//                     <filter id="blob">
//                         <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
//                     </filter>
//                 </defs>
//                 <circle cx="10%" cy="50%" r="150" fill="white" filter="url(#blob)" />
//                 <circle cx="90%" cy="30%" r="120" fill="white" filter="url(#blob)" />
//                 <circle cx="50%" cy="80%" r="100" fill="white" filter="url(#blob)" opacity="0.5" />
//                 <circle cx="30%" cy="20%" r="80" fill="white" filter="url(#blob)" opacity="0.3" />
//                 <circle cx="80%" cy="70%" r="140" fill="white" filter="url(#blob)" opacity="0.4" />
//             </svg>

//             {/* Floating particles */}
//             {[...Array(12)].map((_, i) => (
//                 <motion.div
//                     key={i}
//                     className="absolute w-1 h-1 bg-white/40 rounded-full"
//                     initial={{
//                         x: `${Math.random() * 100}%`,
//                         y: `${Math.random() * 100}%`,
//                         opacity: 0
//                     }}
//                     animate={{
//                         y: ['-20px', '20px', '-20px'],
//                         opacity: [0, 1, 0]
//                     }}
//                     transition={{
//                         duration: 3 + Math.random() * 2,
//                         repeat: Infinity,
//                         delay: Math.random() * 2
//                     }}
//                 />
//             ))}

//             {/* Content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="backdrop-blur-sm bg-white/10 rounded-xl border border-white/20"
//                 >
//                     <div className="px-6 py-3">
//                         <p className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide">
//                             দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                         </p>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// }   

// import React from 'react';
// import { motion } from 'framer-motion';

// export default function WavePatternBanner() {
//     return (
//         <div className="relative w-full overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600">
//             {/* Wave SVG overlay */}
//             <div className="absolute inset-0 opacity-20">
//                 <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
//                     <path fill="rgba(255,255,255,0.3)" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,170.7C672,160,768,160,864,165.3C960,171,1056,181,1152,186.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
//                 </svg>
//             </div>

//             {/* Decorative circles */}
//             <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
//             <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 blur-3xl" />

//             {/* Dotted pattern */}
//             <div className="absolute inset-0 opacity-10" style={{
//                 backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
//                 backgroundSize: '24px 24px'
//             }} />

//             {/* Content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="flex items-center justify-center gap-3"
//                 >
//                     <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                         className="w-6 h-6 rounded-full border-2 border-white/30"
//                     />

//                     <p className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-semibold tracking-wide">
//                         দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                     </p>

//                     <motion.div
//                         animate={{ rotate: -360 }}
//                         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                         className="w-6 h-6 rounded-full border-2 border-white/30"
//                     />
//                 </motion.div>
//             </div>
//         </div>
//     );
// }

// import React from 'react';
// import { motion } from 'framer-motion';

// export default function SolidBackgroundBanner() {
//     return (
//         <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary">
//             {/* Decorative shapes - top left */}
//             <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
//             <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-white/5 blur-xl" />

//             {/* Decorative shapes - top right */}
//             <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/20 blur-3xl" />
//             <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-white/10 blur-xl" />

//             {/* Decorative shapes - bottom left */}
//             <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-accent/15 blur-2xl" />
//             <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-white/5 blur-lg" />

//             {/* Decorative shapes - bottom right */}
//             <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-white/10 blur-3xl" />
//             <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-accent/20 blur-xl" />

//             {/* Floating small circles */}
//             <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-white/40 animate-pulse" />
//             <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-white/30 animate-pulse delay-500" />
//             <div className="absolute bottom-1/4 left-2/3 w-2 h-2 rounded-full bg-white/40 animate-pulse delay-1000" />
//             <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse delay-700" />

//             {/* Diagonal lines pattern */}
//             <div className="absolute inset-0 opacity-10" style={{
//                 backgroundImage: `repeating-linear-gradient(
//           45deg,
//           transparent,
//           transparent 20px,
//           rgba(255,255,255,0.1) 20px,
//           rgba(255,255,255,0.1) 40px
//         )`
//             }} />

//             {/* Main content */}
//             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
//                 <motion.p
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     whileHover={{ scale: 1.02 }}
//                     className="text-center text-white font-bengali text-sm sm:text-base md:text-lg font-medium tracking-wide drop-shadow-lg"
//                 >
//                     দ্বীনের খেদমতে আপনার সহযোগিতা আমাদের শক্তি
//                 </motion.p>

//                 {/* Animated underline effect */}
//                 <motion.div
//                     className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-white/30 rounded-full"
//                     initial={{ width: 0 }}
//                     animate={{ width: '100px' }}
//                     transition={{ delay: 0.5, duration: 0.8 }}
//                     style={{ maxWidth: '80%' }}
//                 />
//             </div>
//         </div>
//     );
// }