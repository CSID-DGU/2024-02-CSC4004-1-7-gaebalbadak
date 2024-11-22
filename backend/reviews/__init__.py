import os

java_home = os.getenv("JAVA_HOME")
if java_home is None:
    raise EnvironmentError("JAVA_HOME 환경 변수가 설정되지 않았습니다.")
jvm_path = os.path.join(java_home, 'bin', 'server', 'jvm.dll')
