import csv
import os

def show_top_10_passengers():
    """train.csv에서 요금이 높은 상위 10명을 터미널에 출력"""
    # 현재 파일의 디렉토리 경로
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'train.csv')
    
    # CSV 파일 읽기
    passengers = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 요금을 float로 변환 (빈 값은 0으로 처리)
            try:
                fare = float(row['Fare']) if row['Fare'] else 0.0
            except ValueError:
                fare = 0.0
            passengers.append({
                'PassengerId': row['PassengerId'],
                'Name': row['Name'],
                'Survived': row['Survived'],
                'Pclass': row['Pclass'],
                'Sex': row['Sex'],
                'Age': row['Age'],
                'Fare': fare,
                'Embarked': row['Embarked']
            })
    
    # 요금 기준으로 내림차순 정렬
    passengers_sorted = sorted(passengers, key=lambda x: x['Fare'], reverse=True)
    top_10 = passengers_sorted[:10]
    
    # 터미널에 출력
    print("=" * 100)
    print("타이타닉 승객 중 요금이 높은 상위 10명")
    print("=" * 100)
    print()
    
    for rank, passenger in enumerate(top_10, 1):
        print(f"순위: {rank}")
        print(f"  이름: {passenger['Name']}")
        print(f"  생존 여부: {'생존' if passenger['Survived'] == '1' else '사망'}")
        print(f"  객실 등급: {passenger['Pclass']}등급")
        print(f"  성별: {passenger['Sex']}")
        print(f"  나이: {passenger['Age'] if passenger['Age'] else 'N/A'}")
        print(f"  요금: ${passenger['Fare']:.2f}")
        print(f"  탑승 항구: {passenger['Embarked'] if passenger['Embarked'] else 'N/A'}")
        print("-" * 100)
    
    print()
    print(f"총 {len(passengers)}명 중 상위 10명을 표시했습니다.")

if __name__ == "__main__":
    show_top_10_passengers()

