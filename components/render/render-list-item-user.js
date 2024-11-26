import { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Styles } from '../../assets/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function RenderListItemUser() {
  const { nestedCard } = Styles();

  const cardTitleRight = useCallback(() => {
    return (
      <TouchableOpacity>
        <MaterialCommunityIcons name="pencil" size={30} />
      </TouchableOpacity>
    );
  }, []);

  return ({ item }) => {
    const { title } = item;
    return (
      <Card rounded style={nestedCard}>
        <Card.Content>
          <Card.Title
            title={title}
            right={cardTitleRight}
          />
        </Card.Content>
      </Card>
    );
  };
}