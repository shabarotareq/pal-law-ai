// ✅ نموذج المحكمة مع التحقق من وجود الملف
function CourtroomModel() {
  const modelPath = "/models/courtroom.glb";

  useEffect(() => {
    // تحقق من وجود الملف قبل التحميل
    fetch(modelPath)
      .then((res) => {
        if (!res.ok) throw new Error(`❌ الملف غير موجود: ${modelPath}`);
        console.log(`✅ تم العثور على الملف: ${modelPath}`);
      })
      .catch((err) => console.error("⚠️ خطأ في تحميل النموذج:", err));
  }, []);

  const { scene } = useGLTF(modelPath);
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.5} position={[0, -1.5, 0]} />;
}
